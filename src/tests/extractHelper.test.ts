import { test, describe, expect } from "vitest";
import { extractCounterTypeFromTopic, extractUserIdFromTopic } from "../helpers/extractHelpers";

describe('properly extracts user id from topic', async() => {
    test('should return user id ', () => {
        const result = extractUserIdFromTopic('gas/0372843/live')
        expect(result).toEqual('0372843')
    })

    test('properly extracts user id from topic with wrong input type', () => {
        const result = extractUserIdFromTopic(456456)
        expect(result).toEqual('456456')
    })
})