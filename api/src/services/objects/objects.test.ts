import { deleteObject, objects } from './objects'
import type { StandardScenario } from './objects.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('objects', () => {
    scenario('returns all objects', async (scenario: StandardScenario) => {
        const result = await objects()

        expect(result.length).toEqual(Object.keys(scenario.object).length)
    })

    scenario('returns a single object', async (scenario: StandardScenario) => {
        const result = await objects({ prefix: scenario.object.one.filename })

        expect(result).toEqual(scenario.object.one)
    })

    scenario('deletes a object', async (scenario: StandardScenario) => {
        await deleteObject({
            filename: scenario.object.one.filename
        })
        const result = await objects({ prefix: scenario.object.one.filename })

        expect(result).toEqual(null)
    })
})
