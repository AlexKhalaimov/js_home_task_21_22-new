/*jshint esversion: 6 */


    'use strict';
    
    function Model(){
        var self = this;
          this.getObj = function (name) {
            let test = localStorage.getItem(name);
            test = JSON.parse(test);
            return test;
        };



        self.userAnsw = [];
        self.mychecking = [];
        self.inputs = document.getElementsByClassName('test_answers');

        self.test = this.getObj('myTest');



    }



    function View (model){
        var self = this;
        var  parent = document.body;
        let wrapper = document.querySelector('.wrapper');
        let overlay,
           div,
            li,
            ul,
           resetBtn;

         self.createTag  = function (tag, classname, parent){
            var el = document.createElement(tag);
            el.className = classname;
            parent.appendChild(el);

            return el;

        };

         function setAttr(el, obj){

            for (var key in obj.attrib){
                el.setAttribute(key, obj.attrib[key]);
            }
                if (obj.text !== 0 ) {
                    el.appendChild(document.createTextNode(obj.text));
                }

        };

          self.addText = function(el, text){
            el.appendChild(document.createTextNode(text));
        };

        let resetBtnAttr = {
            attrib : {
                type : 'button',
                name : 'btnStart',
                id : 'reset'
            },
            text : 'Close'

        };

         self.showResult = function(){

            let wrapper = document.querySelector('.wrapper');
            overlay = self.createTag('div', 'overlay', wrapper);
            div = self.createTag('div', 'modal', wrapper);
             ul = self.createTag('ul', 'answer_list', div);
            resetBtn = self.createTag('button', 'reset', div);
            setAttr(resetBtn, resetBtnAttr);


       };

        self.resetResult = function() {
            let wrapper = document.querySelector('.wrapper');
           div.removeChild(resetBtn);
           wrapper.removeChild(overlay);
           wrapper.removeChild(div);
       };

        function initHTML() {
            var wrapper,
                form,
                header,
                submitBtn;

            let submitBtnAttr = {
                    attrib : {
                        type : 'button',
                        name : 'button',
                        id : "submit"
                    },
                    text : 'Check my Answers!'
                };



             wrapper = self.createTag('div', 'wrapper', parent);

             form = self.createTag('form', 'testForm', wrapper);
             header = self.createTag('h1', 'header', form);
             self.addText(header, 'This is simple test' );



            function createBlock(object, name) {
                let header,
                    label,
                    input,
                    text;


                header = self.createTag('h3', 'subheader', form);
                self.addText(header, name);
                for (let key in object){
                     label = self.createTag('label', 'form_label', form);
                     input = self.createTag('input', 'test_answers', label);
                     text = object[key];

                     let inputAttr = {
                             attrib : {
                                 type : 'radio',
                                 name : name,
                                 value : text
                             }

                         };
                    setAttr(input, inputAttr);
                    self.addText(label, text);

                }
            }

            var test = model.getObj('myTest');

            createBlock(test.section1, test.title1);
            createBlock(test.section2, test.title2);
            createBlock(test.section3, test.title3);

            submitBtn = self.createTag('button', 'submit', form);
            setAttr(submitBtn, submitBtnAttr);


        }
        initHTML();

    }

    function Controller(model, view){
        var self = this;
        let submitBtn = document.getElementById('submit');
        submitBtn.addEventListener('click', showResult);


        function checkAnswers() {
            for (let i = 0; i < model.inputs.length; i++) {
                if (model.inputs[i].type=="radio" && model.inputs[i].checked){


                     let value = model.inputs[i].value;
                     model.userAnsw.push(value);


                }
            }


            for (let k = 0; k < model.test.correct.length; k++) {
                let  checking = model.userAnsw[k] === model.test.correct[k];

                    if (checking === true) {
                        model.mychecking.push('correct');
                    }
                    else {
                        model.mychecking.push('wrong');
                    }
            }
        }

        function resetResult() {

           model.mychecking.splice(0, (model.mychecking.length + 1));
           model.userAnsw.splice(0, (model.userAnsw.length + 1));

               for (let i = 0; i < model.inputs.length; i++) {
               if (model.inputs[i].type=="radio" && model.inputs[i].checked){
                       model.inputs[i].checked=false;

               }
           }
           view.resetResult();
       };

       function showResult(){
           checkAnswers();
           view.showResult();

           var resetBtn = document.getElementById('reset');
           resetBtn.addEventListener('click', resetResult);



         for (let i = 0; i < model.mychecking.length; i++) {
             var ul = document.querySelector('.answer_list');
             let test_result = `Question ${i+1}:  Your answer is ${model.mychecking[i]}`;
             let li = view.createTag('li', 'answer_list_item', ul);

             view.addText(li, test_result);

         }
     };


    }

document.addEventListener("DOMContentLoaded", function(event) {

  var model = new Model();

  var view = new View(model);

  var controller = new Controller(model, view);
});
