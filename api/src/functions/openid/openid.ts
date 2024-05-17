import type { APIGatewayEvent, Context } from 'aws-lambda'
import { Client, IdTokenClaims, Issuer } from 'openid-client'

import { cookieName, encryptSession } from '@redwoodjs/auth-dbauth-api'

import { cookieName as dbAuthCookieName } from 'src/lib/auth'
import { db } from 'src/lib/db'

type User = {
    id: string
    name: string
    avatar: string
}

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
            return redirect(
                client.authorizationUrl({ scope: process.env.OPENID_SCOPES })
            )

        case '/openid/callback':
            if (
                !event.queryStringParameters ||
                !event.queryStringParameters.code
            ) {
                return {
                    statusCode: 400
                }
            }
            return await callback(event.queryStringParameters.code)

        case '/openid/logout':
            return redirect(client.endSessionUrl(), sessionCookie(new Date(0)))

        default:
            return {
                statusCode: 404
            }
    }
}

const redirect = (location: string, cookie?: string) => ({
    statusCode: 302,
    headers: {
        Location: location,
        ...(cookie && { 'Set-Cookie': cookie })
    }
})

const callback = async (code: string) => {
    try {
        const tokenSet = await client.callback(
            process.env.OPENID_REDIRECT_URI,
            { code }
        )

        const user = await getUser(tokenSet.claims())

        const cookie = secureCookie(user, tokenSet.claims().exp)

        return {
            statusCode: 302,
            headers: {
                'Set-Cookie': cookie,
                Location: '/'
            }
        }
    } catch (e) {
        return {
            statusCode: 500
        }
    }
}

const getUser = async (userInfo: IdTokenClaims): Promise<User> => {
    const name =
        userInfo.name.trim() !== ''
            ? userInfo.name.trim()
            : userInfo.preferred_username

    return db.user.upsert({
        where: { id: userInfo.sub },
        create: {
            id: userInfo.sub,
            name,
            avatar: userInfo.avatar as string
        },
        update: {
            name,
            avatar: userInfo.avatar as string
        }
    })
}

const sessionCookie = (exp: Date, encryptedContent = ''): string => {
    const cookieAttrs = [
        `Expires=${exp.toUTCString()}`,
        'HttpOnly=true',
        'Path=/',
        'SameSite=Strict',
        `Secure=${process.env.NODE_ENV !== 'development'}`
    ]

    return [
        `${cookieName(dbAuthCookieName)}=${encryptedContent}`,
        ...cookieAttrs
    ].join('; ')
}

const secureCookie = (data: User, exp: number): string => {
    const expires = new Date(exp * 1000)

    const encrypted = encryptSession(JSON.stringify(data))

    return sessionCookie(expires, encrypted)
}
