export function translate(key, options, locale){
    if(window.Creator && window.TAPi18n){
        return window.TAPi18n.__(key, options, locale)
    }else{
        return key;
    }
}