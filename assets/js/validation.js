// Validator Object
function Validator(options){
    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var formElement = $(options.form);
    var selectorRules=[];
    if(formElement){
        // Kiem tra toan bo input rules khi submit form
        formElement.onsubmit =function(e){
            var isFormValid=true;
            e.preventDefault();
            options.rules.forEach(rule => {
                var inputElements = formElement.querySelectorAll(rule.selector);
                Array.from(inputElements).forEach(inputElement=>{
                    var parentElement = getParent(inputElement,options.formGroupSelector);
                    var errElement=parentElement.querySelector(options.errSelector);
                    var errMessage;
                    for(var i=0;i<selectorRules[rule.selector].length;i++){
                        switch(inputElement.type){
                            case 'checkbox':
                            case 'radio':
                                errMessage =selectorRules[rule.selector][i](inputElement.checked);
                                break;
                            default:
                                errMessage = selectorRules[rule.selector][i](inputElement.value);
                        }
                        
                        if(errMessage) {
                            isFormValid=false;
                            break;
                        }
                    }
                    errElement.innerHTML = errMessage ??= '';
                    parentElement.classList.toggle('invalid',errMessage);
                });
            });

            // Khi Form hop le
            if(isFormValid) {
                if(typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                    var formValues=Array.from(enableInputs).reduce(function(values,input){
                        switch(input.type){
                            case 'checkbox':
                                if(!Array.isArray(values[input.name])){
                                    values[input.name]=[];
                                }
                                if(!input.checked){
                                    return values;
                                } else{
                                    values[input.name].push(input.value);
                                }   
                                break;
                            case 'radio':
                                if(input.checked && !values[input.name]){
                                    values[input.name]=input.value;
                                }
                                break;
                            case 'file':
                                values[input.name]=input.files;
                                break;
                            default:
                                values[input.name]=input.value;
                        }
                        return values;
                    },{});
                    options.onSubmit(formValues);
                } else{

                }
            }
        }

        // Kiem tra rule cua tung Input
        options.rules.forEach(rule => {
            var inputElements = formElement.querySelectorAll(rule.selector);
            
            // Luu lai rule cua moi Input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);    
            } else{
                selectorRules[rule.selector] = [rule.test]
            }

            Array.from(inputElements).forEach(inputElement=>{
                var parentElement = getParent(inputElement,options.formGroupSelector);
                var errElement=parentElement.querySelector(options.errSelector);
                if(inputElement){
                    // Kiem tra thong tin khi blur ra khoi Input
                    inputElement.addEventListener('blur',function(){
                        var errMessage;
                        for(var i=0;i<selectorRules[rule.selector].length;i++){
                            switch(inputElement.type){
                                case 'checkbox':
                                case 'radio':
                                    errMessage =selectorRules[rule.selector][i](inputElement.checked);
                                    break;
                                default:
                                    errMessage = selectorRules[rule.selector][i](inputElement.value);
                            }
                    
                            if(errMessage) break;
                        }
                        errElement.innerHTML = errMessage ??= '';
                        parentElement.classList.toggle('invalid',errMessage);
                    });
                    //Xu ly truong hop moi khi nguoi dung nhap vao input
                    inputElement.addEventListener('input',function(){
                        errElement.innerHTML = '';
                        parentElement.classList.remove('invalid');
                    });
                }
            })
            
        });
    }
}

// Dinh nghia Rules
// Nguyên tắc của các rules
// 1. Khi có lỗi => Return message lỗi
// 2. Khi hợp lệ => Return undefined
Validator.isRequired=function(selector){
    return {
        selector: selector,
        test:function(value){
            return value.trim()? undefined : "*This field is required.";
        }
    }
}

Validator.isEmail=function(selector){
    return {
        selector: selector,
        test:function(value){
            var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return emailRegex.test(value)? undefined : "*Please use a valid email address.";
        }
    }
}

Validator.isAtLeast=function(selector, atLeastValue,message){
    return {
        selector: selector,
        test:function(value){
            return value.length>=atLeastValue? undefined : "*"+message+ " must be at least " + atLeastValue + " characters long.";
        }
    }
}

Validator.isConfirm=function(selector,getPassword,message){
    return {
        selector: selector,
        test:function(value){
            return value===getPassword()? undefined : "*"+message+" does not match.";
        }
    }
}
Validator.isChecked=function(selector,message){
    return {
        selector: selector,
        test:function(value){
            return value? undefined : "*Please agree to accept "+message+" before submitting.";
        }
    }
}