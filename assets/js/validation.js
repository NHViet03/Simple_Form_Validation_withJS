// Validator Object
function Validator(options){
    var formElement = $(options.form);
    if(formElement){
        options.rules.forEach(rule => {
            var inputElement = formElement.querySelector(rule.selector);
            var parentElement = inputElement.parentElement;
            var errElement=parentElement.querySelector(options.errSelector);
                
            if(inputElement){
                // Kiem tra thong tin khi blur ra khoi Input
                inputElement.onblur=function(){
                    var errMessage = rule.test(inputElement.value);
                    errElement.innerHTML = errMessage ??= '';
                    parentElement.classList.toggle('invalid',errMessage);
                }
                //Xu ly truong hop moi khi nguoi dung nhap vao input
                inputElement.oninput=function(){
                    errElement.innerHTML = '';
                    parentElement.classList.remove('invalid');
                }
            }
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
Validator.isAtLeast=function(selector, atLeastValue){
    return {
        selector: selector,
        test:function(value){
            return value.length>=atLeastValue? undefined : "*Password must be at least " + atLeastValue + " characters long.";
        }
    }
}
