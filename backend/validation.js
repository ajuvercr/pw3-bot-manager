// Fixme: Validation is not like this, when validating construct new object with validated fields
//        This is the way to go to remove unwanted fields and be pretty <3

function isObject(obj) {
    return typeof(obj) === 'object' && !Array.isArray(obj)
}

function isArray(obj) {
    return typeof(obj) === 'object' && Array.isArray(obj)
}

function validate_some(validator, obj, path, acum) {
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
            validate_some(field_validator, obj[field], new_path, acum)
        }
    }

    return acum;
}
module.exports = validate

module.exports.validate_string = function() {
    return (obj, path, acum) => (typeof obj === "string") || acum.push(`'${path}' should be a string`);
}

module.exports.validate_number = function() {
    return (obj, path, acum) => (typeof obj === "number") || acum.push(`'${path}' should be a number`);
}

module.exports.validate_array = function(validator) {
    return (obj, path, acum) => {
        if(!isArray(obj))
            return acum.push(`'${path}' should be an array`);
        for(let i in obj) {
            const new_path = `${path}[${i}]`
            validate_some(validator, obj[i], new_path, acum);
        }
        return acum;
    };
}
