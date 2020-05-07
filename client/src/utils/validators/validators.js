import React from 'react'

export const requiredField = (value) => {
    if (value) return undefined;
    return 'Field is required';
}

export const maxLength = (maxLength) => (value) =>
    value.length > maxLength ?`Max length is ${maxLength} symbols` : undefined


export const minLength = (minLength) => (value) => {
    if (value.length < minLength) return `Min length is ${minLength} symbols`;
    return undefined;
}

export const number = value =>
    value && isNaN(Number(value)) ? 'Must be a number' : undefined

export const minValue = min => value =>
    value && value < min ? `Must be at least ${min}` : undefined

export const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? 'Invalid email address'
        : undefined

export const alphaNumeric = value =>
    value && /[^a-zA-Z0-9 ]/i.test(value)
        ? 'Only alphanumeric characters'
        : undefined

export const onlyLetters = value =>
    value && /[^a-zA-Z ]/i.test(value)
        ? 'Only alphanumeric characters'
        : undefined