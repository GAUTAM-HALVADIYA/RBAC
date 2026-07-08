function getChanges(oldData: any, newData: any) {
    const changes: any = {};

    const ignoreField = ["__v", "timestamp", "createdAt", "updatedAt"];

    Object.keys(newData).forEach((key) => {
        if (ignoreField.includes(key)) {
            return;
        }

        if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
            changes[key] = {
                old: oldData[key],
                new: newData[key],
            };
        }
    });

    return changes;
}
