export const parseDataIntoListOfFields = (value: any, labelMap: Map<string, any>, parentKey: string) => {
    if (value === null) {
        return
    }
    let isJSON = false
    const addObjectToMap = (labels: any, parentKey: string, grandParentKey = '', cleanParentKey = '') => {
        const entries = Object.entries(labels)
        entries.forEach((item: any) => {
            let [key, value]: any = item
            if (typeof value === 'object' && Array.isArray(value) === false) {
                addObjectToMap(value, `${parentKey}.${key}`, parentKey, key)
            }
            labelMap.set(`${parentKey}.${key}`, {
                value: value,
                key: `${parentKey}.${key}`,
                label: key,
                group: cleanParentKey,
                parentGroup: grandParentKey,
                depth: parentKey.split('.').length
            })
        })
    }
    try {
        const parsedJson = JSON.parse(value)
        isJSON = parsedJson === 'object';
        if (isJSON) {
            value = parsedJson
        }
        if (typeof parsedJson === 'object' && Array.isArray(value) === false && value !== null) {
            addObjectToMap(parsedJson, parentKey, '', parentKey)
        }
    } catch (e) { }
    if (typeof value === 'object' && Array.isArray(value) === false) {
        addObjectToMap(value, parentKey, '', parentKey)
    } else {

        labelMap.set(parentKey, { value: value, label: parentKey, key: parentKey, group: '', parentGroup: '', depth: 0 })
    }
}
