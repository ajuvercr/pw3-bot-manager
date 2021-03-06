// Fixme: Validation is not like this, when validating construct new object with validated fields
//        This is the way to go to remove unwanted fields and be pretty <3

function isObject(obj) {
    return typeof(obj) === 'object' && !Array.isArray(obj)
}

function isArray(obj) {
    return typeof(obj) === 'object' && Array.isArray(obj)
}

function some(validator, obj, path, acum) {
    if (typeof validator === 'function') {
        return validator(obj, path, acum);
    } else {
        return validate(obj, validator, path, acum);
    }
}

/// Validate object
function validate(obj, validator, path="", acum=[]) {
    if (!isObject(obj)) {
        acum.push(`${path} should be an object`);
        return acum;
    }

    for(let field in validator) {
        const field_validator = validator[field];
        const new_path = path + "." + field;

        if(!obj.hasOwnProperty(field)) {
            acum.push(`Required field '${new_path}'`);
        } else {
            some(field_validator, obj[field], new_path, acum)
        }
    }

    return acum;
}
module.exports = validate

module.exports.string = function() {
    return (obj, path, acum) => (typeof obj === "string") || acum.push(`'${path}' should be a string`);
}

module.exports.number = function() {
    return (obj, path, acum) => (typeof obj === "number") || acum.push(`'${path}' should be a number`);
}

module.exports.boolean = function() {
    return (obj, path, acum) => (typeof obj === "boolean") || acum.push(`'${path}' should be a boolean`);
}

module.exports.array = function(validator) {
    return (obj, path, acum) => {
        if(!isArray(obj))
            return acum.push(`'${path}' should be an array`);
        for(let i in obj) {
            const new_path = `${path}[${i}]`
            some(validator, obj[i], new_path, acum);
        }
        return acum;
    };
}

module.exports.custom = function(f) {
    return (obj, path, acum) => {
        const out = f(obj);
        out && acum.push(out);
        return acum;
    }
}

module.exports.and = function(...fs) {
    return (obj, path, acum) => {
        for(let f of fs) {
            some(f, obj, path, acum);
        }
        return acum;
    };
}

module.exports.hex = function(count) {
    const regex = new RegExp(`^([0-9abcdef]){${count}}$`, 'i');
    return (obj, path, acum) => {
        if(!regex.test(obj)) {
            acum.push(`${path} is not hex of length ${count}`);
        }
        return acum;
    };
}
