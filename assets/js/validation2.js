
function Validator(formSelector,options={}) {
    // Get Parent Element
    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector))
                return element.parentElement;
            element = element.parentElement;
        }
    }

    var formElement = document.querySelector(formSelector);
    var formRules={};

    /*Quy uoc
    *Neu co loi => return error message
    * Nguoc lai => return nothing
    */
    var validatorRules = {
        required:function(value){
            return value.trim()? undefined : "*This field is required.";
        },
        email:function(value){
            var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return emailRegex.test(value)? undefined : "*Please use a valid email address.";
        },
        min:function(min){
            return function(value){
                return value.length>=min? undefined : "*This field must be at least " + min + " characters long.";
            }
        },
        max:function(max){
            return function(value){
                return value.length<=max? undefined : "*This field must be at most " + max + " characters long.";
            }
        },
        confirm:function(comparatorValue){
            return function(value){
                return value===comparatorValue()? undefined : "*This field does not match.";
            }
        },
        checked:function(value){
            return value? undefined : "*Please agree to accept before submitting.";
        },
    }

    if(formElement){
        var inputs=formElement.querySelectorAll('[name][rules]');

        for(var input of inputs){
            var rules=input.getAttribute('rules').split('|');
            rules.forEach(rule => {
            if(!Array.isArray(formRules[input.name])){
                formRules[input.name]=[];
            }
            if(rule.includes(':')){
                var ruleInfor=rule.split(':');
                if(ruleInfor[1].includes('password')){
                    var comparator=formElement.querySelector(`[name=${ruleInfor[1]}][type=password]`);
                    formRules[input.name].push(validatorRules[ruleInfor[0]](function(){
                        return comparator.value;
                    }));
                } else{
                    formRules[input.name].push(validatorRules[ruleInfor[0]](ruleInfor[1]));
                }
            } else{
                formRules[input.name].push(validatorRules[rule]);
            }
            });

            // Lang nghe event 
            input.onblur = function(event){
                handleValidate(event,this.type)
            }
            input.oninput=handleClearErrors;
        }
        // Ham validate
        function handleValidate(event,inputType){
            var inputRules=formRules[event.target.name];
            var parentInput=getParent(event.target,'.form-group');
            var errMessage;

            for(var inputRule of inputRules){
                switch(inputType){
                    case 'checkbox':
                    case 'radio':
                        errMessage=inputRule(event.target.checked);
                        break;
                    default:
                        errMessage=inputRule(event.target.value);
                }
                if(errMessage){
                    break;
                }
            }
            parentInput.querySelector('.form-message').innerText=errMessage ??= '';
            parentInput.classList.toggle('invalid',errMessage);
            return !errMessage;
        }

        // Ham tat thong bao loi khi nguoi dung dang nhap du lieu
        function handleClearErrors(event) {
            var inputRules=formRules[event.target.name];
            var parentInput=getParent(event.target,'.form-group');
            if(parentInput){
                parentInput.querySelector('.form-message').innerText='';
                parentInput.classList.remove('invalid');
            }
        }


        // Xu ly hanh vi submit form
        formElement.onsubmit=(event) =>{
            event.preventDefault();
            var inputs=formElement.querySelectorAll('[name][rules]');
            var isValidForm=true;
            for(var input of inputs){
                if(!handleValidate({ target:input},input.type)){
                    isValidForm=false;
                }
            }

            // Xu ly khi form hop le
            if(isValidForm) {
                if(typeof this.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                    var formValues=Array.from(enableInputs ).reduce(function(values,input){
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
                                if(input.checked){
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
                    },{})
                    this.onSubmit(formValues);
                } else{
                    formElement.submit();
                }
            }
        }
    }
}
