import { Object as gqlObject } from 'types/graphql'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario({
    object: {
        one: {
            data: {
                filename: 'filenameOne',
                etag: 'etagOne',
                size: 39150,
                expires: new Date().toISOString()
            }
        },
        two: {
            data: {
                filename: 'filenameTwo',
                etag: 'etagTwo',
                size: 149876,
                expires: new Date().toISOString()
            }
        }
    }
})

export type StandardScenario = ScenarioData<gqlObject, 'object'>
