export function extractUserIdFromTopic(topic:string){
    const UID = topic.split('/')[1]
    return UID
}

export function extractCounterTypeFromTopic(topic:string){
    const type:string = topic.split('/')[0]
    return type
}