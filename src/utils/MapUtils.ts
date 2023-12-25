export function objectToMap(o: any) {
    let m = new Map()
    for(let k of Object.keys(o)) {
        if(o[k] instanceof Object) {
            m.set(k, objectToMap(o[k]))   
        }
        else {
            m.set(k, o[k])
        }    
    }
    return m
}