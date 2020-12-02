(function($) {
    var isProcessing = false;
    var form = $("#signup-form");
    form.validate({
        errorPlacement: function errorPlacement(error, element) {
             element.before(error); 
        },
        rules: {
            full_name : {
                required: true,
            },
            // last_name : {
            //     required: true,
            // },
            class: {
                required: true,
            },
            user_name : {
                required: true,
            },
            password : {
                required: true,
            },
            // email : {
            //     required: true,
            // },
            phone : {
                required: true,
            },
            parentname : {
                required: true,
            },
            parentphone : {
                required: true,
            },
            collegename : {
                required: true,
            },
            city : {
                required: true,
            },
            // address: {
            //     required: true,
            // },
            // employee_id : {
            //     required: true,
            // },
            // designation: {
            //     required: true,
            // },
            // department: {
            //     required: true,
            // },
            // work_hours: {
            //     required: true,
            // },
            // bank_name: {
            //     required: true,
            // },
            // holder_name: {
            //     required: true,
            // },
            // card_number: {
            //     required: true,
            //     number: true,
            // },
            // cvc: {
            //     required: true,
            // },
        },
        onfocusout: function(element) {
            $(element).valid();
        },
        highlight : function(element, errorClass, validClass) {
            $(element.form).find('.actions').addClass('form-error');
            $(element).removeClass('valid');
            $(element).addClass('error');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element.form).find('.actions').removeClass('form-error');
            $(element).removeClass('error');
            $(element).addClass('valid');
        }
    });
    form.steps({
        headerTag: "h3",
        bodyTag: "fieldset",
        transitionEffect: "fade",
        labels: {
            previous : 'Previous',
            next : 'Next',
            finish : 'Submit',
            current : ''
        },
        titleTemplate : '<span class="title">#title#</span>',
        onStepChanging: function (event, currentIndex, newIndex)
        {
            if (currentIndex > newIndex)
            {
                return true;
            }
            form.validate().settings.ignore = ":disabled,:hidden";
            return form.valid();
        },
        onFinishing: function (event, currentIndex)
        {
            form.validate().settings.ignore = ":disabled,:hidden";
            return form.valid();
        },
        onFinished: function (event, currentIndex)
        {
            if (isProcessing == true) {
                return false;
            }
            if (form.valid())
            {
                $('#loaderAnim').show();
                isProcessing = true;

                let cred = {};
                cred['email'] = $('#user_name').val();
                cred['password'] = $('#password').val();

                let college = {};
                if ($('#colleges').val() === 'other') {
                    college['name'] = $('#collegename').val();
                    college['city'] = $('#city').val();
                    college['code'] = '';
                    college['pid'] = '';
                    college['students'] = 1;
                    college['date'] = new Date(Date.now());
                }
                else {
                    college['cid'] = $('#colleges').val();
                }

                let studentDetails = {};
                studentDetails['classAssigned'] = parseInt($('#class').val());
                studentDetails['email'] = $('#user_name').val();
                studentDetails['name'] = $('#full_name').val();
                studentDetails['parentName'] = $('#parentname').val();
                studentDetails['parentPhone'] = $('#parentphone').val();
                studentDetails['phone'] = $('#phone').val();
                studentDetails['year'] = new Date(Date.now()).getFullYear();

                
                let xdata = {};
                xdata['cred'] = cred;
                xdata['college'] = college;
                xdata['student'] = studentDetails;
                
                
                $.post({
                    url: 'https://us-central1-phylab-65237.cloudfunctions.net/registerExternalStudent',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(xdata),
                    success: function (result) {
                        console.log(result);
                        $('#paymentTab').show();
                        $('#signup-form').hide();
                        return true;
                    }
                })
                .done(function() {
                    alert( "second success" );
                })
                .fail(function(xhr, status, error) {
                    alert( error );
                })
                .always(function() {
                    $('#loaderAnim').hide();
                    isProcessing = false;
                });
                return true;
            }
            else {
                console.log("Invalid");
                return false;
            }
        },
        // onInit : function (event, currentIndex) {
        //     event.append('demo');
        // }
    });

    jQuery.extend(jQuery.validator.messages, {
        required: "",
        remote: "",
        email: "",
        url: "",
        date: "",
        dateISO: "",
        number: "",
        digits: "",
        creditcard: "",
        equalTo: ""
    });

    updateColleges = function () {
        $.get({
            url: 'https://us-central1-phylab-65237.cloudfunctions.net/getCollegesList',
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {
                console.log(result);
                $("#colleges option").remove();
                
                for (var k in result) {
                    var t = result[k].name + ', ' + result[k].city;
                    $('#colleges').append(`<option value="${k}"> 
                                       ${t} 
                                  </option>`); 
                }
                $('#colleges').append(`<option value="other"> 
                                       Other 
                                  </option>`);
                $('#idforcollegename').hide();
                $('#idforcollegecity').hide();
            }
        })
        .done(function() {
            // alert( "second success" );
        })
        .fail(function(xhr, status, error) {
            updateColleges();
        })
        .always(function() {
            // alert( "finished" );
        });
    }

    updateColleges();
    
    $('#colleges').on('change', function() {
        if (this.value === 'other') {
             $('#idforcollegename').show();
                $('#idforcollegecity').show();
        }
        else {
            $('#idforcollegename').hide();
            $('#idforcollegecity').hide();
        }            
    });

    $('#loaderAnim').hide();
    $('#paymentTab').hide();
    
})(jQuery);