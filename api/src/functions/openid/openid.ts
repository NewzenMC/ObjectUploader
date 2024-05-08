import type {APIGatewayEvent, APIGatewayProxyEvent, Context} from 'aws-lambda'
import {Client, Issuer} from 'openid-client'
import {cookieName, encryptSession} from "@redwoodjs/auth-dbauth-api";
import {db} from 'src/lib/db'
import {cookieName as dbAuthCookieName} from "src/lib/auth";

let issuer: Issuer = null
let client: Client = null

export const handler = async (event: APIGatewayEvent, _context: Context) => {
    if (!issuer || !client) {
        issuer = await Issuer.discover(process.env.OPENID_DISCOVERY_URL)
        client = new issuer.Client({
            client_id: process.env.OPENID_CLIENT_ID,
            client_secret: process.env.OPENID_CLIENT_SECRET,
            redirect_uris: [process.env.OPENID_REDIRECT_URI],
            response_types: ['code']
        })
    }

    switch (event.path) {
        case '/openid/auth':
            return {
                statusCode: 302,
                headers: {
                    Location: client.authorizationUrl({scope: process.env.OPENID_SCOPES})
                }
            }
        case '/openid/callback':
            return await callback(event)
        case '/openid/logout':
            return {
                statusCode: 302,
                headers: {
                    'Set-Cookie': `${cookieName(dbAuthCookieName)}=; Expires=${new Date(0).toUTCString()}; Path=/`,
                    Location: client.endSessionUrl(),
                },
            }
        default:
            return {
                statusCode: 404
            }
    }
}

const callback = async (event: APIGatewayProxyEvent) => {
    const {code} = event.queryStringParameters

    try {
        const tokenSet = await client.callback(
            process.env.OPENID_REDIRECT_URI,
            {
                code
            }
        )

        const user = await getUser(tokenSet.claims())

        const cookie = secureCookie(user, tokenSet.claims().exp)

        return {
            statusCode: 302,
            headers: {
                'Set-Cookie': cookie,
                Location: '/',
            },
        }
    } catch (e) {
        console.log(e)
        return {
            statusCode: 500
        }
    }
}

const getUser = async (userInfo: any) => {
    const name = userInfo.name.trim() !== '' ? userInfo.name : userInfo.preferred_username
    return db.user.upsert({
        where: {id: userInfo.sub},
        create: {
            id: userInfo.sub,
            name,
            avatar: userInfo.avatar,
        },
        update: {
            name,
            avatar: userInfo.avatar,
        },
    })
}

const secureCookie = (data: any, exp: number) => {
    const expires = new Date(exp * 1000)

    const cookieAttrs = [
        `Expires=${expires.toUTCString()}`,
        'HttpOnly=true',
        'Path=/',
        'SameSite=Strict',
        `Secure=${process.env.NODE_ENV !== 'development'}`,
    ]

    const encrypted = encryptSession(JSON.stringify(data))

    return [`${cookieName(dbAuthCookieName)}=${encrypted}`, ...cookieAttrs].join('; ')
}
