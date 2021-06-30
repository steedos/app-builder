export function translate(key, options, locale){
    console.log(`in translate`, key)
    if(window.Creator && window.TAPi18n){
        return window.TAPi18n.__(key, options, locale)
    }else{
        return key;
    }
}