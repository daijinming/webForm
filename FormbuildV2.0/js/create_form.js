/**
 * Created by Administrator on 2017/6/5 0005.
 */


var formItemsJson = new Array();

function scrollToLocation() {

    var mainContainer = $('#create-form'),
    scrollToContainer = mainContainer.find('.form-group:last');
    
    var y = scrollToContainer.offset().top- mainContainer.offset().top + mainContainer.scrollTop();
    //y += 150;

    //top.window.scrollTo(0,y);
    
    //alert(y);
    

}

  
//点击标题添加编辑
function add_edit_form(item) {
    //获得具体的实例属性对象
    var current_item = formCommonItems[item];
    //获得要创建元素的属性 type
    var item_type = current_item.Type;
    //获得Subitems 数组 根据length 和 type 决定是否有选项列表
    var subitem = current_item.Subitems;
    //定义模板HTML
    var formElement = ""
    var item_title = current_item.Title;
    var type_title = current_item.TypeTitle;
    var item_description = current_item.Description;
    var item_typeTitle = current_item.TypeTitle;
    var item_require = current_item.Required;
    //如果是单选按钮、多选框、下拉框  让选项列表显示
    if (item_type == "radio" || item_type == "checkbox" || item_type == "select") {
        //如果subitems 有文字显示 显示input框 + 加号
        var tpl = "";
        var array_item = new Array();
        tpl = `
           <div class="form-group" style="height:auto;">
               <label class="control-label col-sm-2">
                   <input type="checkbox" onchange="change_form_dom(0,this,0)">
                   必填
               </label>
               <label class="control-label col-sm-2 text-center label" >
                   <input  onchange="change_form_dom(1,this,0)" type="text" class="form-control" value="${item_title || type_title}">
               </label>
               <div class="col-sm-7">
                   <input onchange="change_form_dom(2,this,0)" type="text" class="form-control" placeholder="提示信息写这里" data-type="${item_type}">
               </div>
               <div class="col-sm-1">
                   <span onClick="change_form_dom(6,this,0)" class="glyphicon glyphicon-trash btn btn-default"></span>
               </div>
               <div class="col-sm-7 col-sm-offset-2">
                   选项列表
                   <div class="row">
               `;
        if (subitem.length > 0) {
            $.each(subitem, function (i, item) {
                tpl += `
                        <div class="col-sm-3">
                           <input onchange="change_form_dom(3,this,${i})" data-sub=${i} type="text" class="form-control" value="${item}">
                           <span onClick="change_form_dom(4,this,${i})" class="glyphicon glyphicon-remove-circle"></span>
                       </div>
                        `;
                array_item.push(item);
            });/*<!--onClick="change_form_dom(5,this,0)"-->*/
        }
        tpl += `
                       <div class="col-sm-3">
                           <button  class="btn btn-default btn-md">
                               <span class="glyphicon glyphicon-plus"></span>
                           </button>
                       </div>
                   </div>
               </div>
           </div>
               `;
        formElement = $(tpl);
    } else { //否则 只显示普通的input
        formElement = $(`
                <div class="form-group">
                    <label class="control-label col-sm-2">
                        <input type="checkbox" onchange="change_form_dom(0,this,0)">
                        必填
                    </label>
                    <label class="control-label col-sm-2 text-center">
                        <input onchange="change_form_dom(1,this,0)" type="text" class="form-control" value="${item_title || type_title}">
                    </label>
                    <div class="col-sm-7">
                        <input onchange="change_form_dom(2,this,0)" type="text" class="form-control" placeholder="提示信息写这里" data-type="${item_type}">
                    </div>
                    <div class="col-sm-1">
                        <span onClick="change_form_dom(6,this,0)" class="glyphicon glyphicon-trash btn btn-default"></span>
                    </div>
                </div>
              `);
    }
    $("#create-form").append(formElement);


    formItemsJson.push({
        "Key": "I_0",
        "Sort": 0,
        "Type": item_type,
        "Category": "CUSTOM",
        "IsDefault": false,
        "Required": item_require,
        "Multiple": false,
        "Title": item_title,
        "Subitems": array_item,
        "Description": item_description,//提示信息
        "IsHide": false,
        "Value": null,
        "TypeTitle": item_typeTitle
    });


    /* for(let i =0;i<formItemsJson.length;i++){
         (function(i){
             "use strict";
             renderFormTpl(i);
             console.log(i);
         })(i)
     }*/

    renderFormTpl(formItemsJson.length - 1);

    scrollToLocation();
}

//移除form元素

$("#create-form").on("click", ".form-group .col-sm-1 .glyphicon-trash", function () {
    var idx = $(this).parents(".form-group").index();
    $("#create-form").children(` .form-group:eq(${idx})`).remove();
    $("#other_form").children(`.form-group:eq(${idx + 1})`).remove();
});

// 添加选项
$("#create-form").on("click", ".form-group .row .btn-md", function () {
    var idx = $(this).parents(".form-group").index();
    var current_item = formItemsJson[idx];
    var subIndex = current_item.Subitems.length;
    var $tpl = $(`
            <div class="col-sm-3">
               <input onchange="change_form_dom(5,this,${subIndex})" type="text" class="form-control" value="">
               <span onClick="change_form_dom(4,this,${subIndex})" class="glyphicon glyphicon-remove-circle"></span>
            </div>
              `);
    $(this).parent().before($tpl);
});

//移除选项
$("#create-form").on("click", ".form-group .row .glyphicon-remove-circle", function () {


    //$(this).parent().remove();


});


//渲染到modal #prev_form 上
function renderFormTpl(item, isChange) {
    if (formItemsJson != null && formItemsJson.length > 0) {

        //获得具体的实例属性对象
        var current_item = formItemsJson[item];
        //获得要创建元素的属性 type
        var item_type = current_item.Type;
        var item_title = current_item.Title;
        var type_title = current_item.TypeTitle;
        var subitem = current_item.Subitems;
        var item_description = current_item.Description;
        var item_require = current_item.Required;
        var tpl = "";
        if (item_type == "select") {
            tpl = `
                     <div class="form-group">
                        <label title="${item_description || type_title}" class="control-label col-sm-2">${item_title || type_title}:</label>
                        <div class="col-sm-2">
                            <select name="${item_title}" required=${item_require} class="form-control">
               `;
            if (subitem.length > 0) {
                $.each(subitem, function (i, item) {
                    tpl += `
                        <option data-sub=${i} value="${item}" data-sub=${i} >${item}</option>
                        `;
                });
            }
            tpl += `
                             </select>
                        </div>
                    </div>
               `;

        } else if (item_type == "textarea") {
            tpl = `
                <div class="form-group">
                        <label class="control-label col-sm-2">${item_title || type_title}:</label>
                        <div class="col-sm-2">
                            <textarea name="${item_title}" required=${item_require} cols="30" rows="10" class="form-control" >${item_description || "请输入"}</textarea>
                        </div>
                    </div>
              `;
        } else if (item_type == "radio") {
            tpl = `
                    <div class="form-group">
                        <label title="${item_description || type_title}" class="control-label col-sm-2">${item_title || type_title}:</label>
                        <div class="col-sm-2">

                `;
            if (subitem.length > 0) {
                $.each(subitem, function (i, item) {
                    tpl += ` <label class="radio-inline">
                                <input name="${item_title}" data-sub=${i} required=${item_require} type="radio" value="${item}" > ${item}
                            </label>
                        `;
                });
            }
            tpl += `</div>
               </div>
              `;
        } else if (item_type == "checkbox") {
            tpl = `
                    <div class="form-group">
                        <label title="${item_description || type_title}" class="control-label col-sm-2">${item_title || type_title}</label>
                        <div class="col-sm-2">
                `;
            if (subitem.length > 0) {
                $.each(subitem, function (i, item) {
                    tpl += ` <label class="checkbox-inline">
                                <input name="${item_title}" data-sub=${i}  required=${item_require} type="checkbox"  value="${item}" > ${item}
                            </label>
                        `;
                });
            }
            tpl += `</div>
               </div>
              `;
        } else {
            tpl = `
                     <div class="form-group">
                        <label class="control-label col-sm-2">${item_title || type_title}:</label>
                        <div class="col-sm-2">
                            <input name="${item_title}" required=${item_require} type="${item_type}" class="form-control" placeholder="${item_description || '请输入'}">
                        </div>
                    </div>
               `;
        }
        form_elem = $(tpl);
        if (isChange == 2) {
            //更新当前元素，先删了在重绘
            var cur = $("#prev_form #other_form").children(".form-group").eq(item + 1);
            cur.remove();
            //console.log($("#prev_form #other_form").children(".form-group").eq(item));
            $("#prev_form #other_form").children(".form-group").eq(item).after(form_elem);
        } else if (isChange == 1) {
            /*var elem = $("#prev_form #other_form").children(".form-group:not(:eq(0))");
            console.log(elem);*/
            $("#prev_form #other_form").append(form_elem);
        } else {

            $("#prev_form #other_form").append(form_elem);
        }
    }
}



//onchange 在 页面 修改时 重新渲染dom
//当点击必选时发生 onchange 事件  给元素添加require 对象的 Required 属性
//  修改label 、input 标签时发生 onchange 事件 修改数组 Title
// 点击删除按钮时发生 onchange 事件  删除元素

// 修改对象的 Subitems 数组
// 点击 × 发生onchange事件    删除标签
// 点击 ＋ 发生onchange 事件   添加标签
// 修改标签内容时发生onchange 事件 添加标签内容
/*
* type 根据type值确定是哪处发生了改变
* itemObj this
* idx   手动获得 是当前form元素的下标，对应formItemsJson数组的下标
* subIndex 是subitems数组中标签对应的下标
* */
function change_form_dom(type, itemObj, subIndex) {

    //alert(type);

    //获得具体的实例属性对象
    if (formItemsJson != null && formItemsJson.length > 0) {
        var elem = $(itemObj)
        var idx = elem.parents(".form-group").index();
        if (type == 0) { // 必选
            formItemsJson[idx].Required = true;
        } else if (type == 1) { //label标签

            $(itemObj).attr("value", $(itemObj).val());

            formItemsJson[idx].Title = elem.val();
        } else if (type == 2) { // 提示消息

            $(itemObj).attr("value", $(itemObj).val());

            formItemsJson[idx].Description = elem.val();
        } else if (type == 3) { //item标签修改内容
            $(itemObj).attr("value", $(itemObj).val());

            if (formItemsJson[idx].Subitems != null && formItemsJson[idx].Subitems.length > subIndex && subIndex >= 0) {

                formItemsJson[idx].Subitems[subIndex] = elem.val();
            }
        } else if (type == 4) { //item标签删除内容

            if (formItemsJson[idx].Subitems != null && formItemsJson[idx].Subitems.length > subIndex && subIndex >= 0) {

                formItemsJson[idx].Subitems.splice(subIndex, 1);
                //var jsonstate1 = JSON.stringify(formItemsJson);
                //alert(jsonstate1);
            }
            $(itemObj).parent().remove();

        } else if (type == 5) { // item标签添加item

            $(itemObj).attr("value", $(itemObj).val());

            if (formItemsJson[idx].Subitems != null && formItemsJson[idx].Subitems.length >= subIndex && subIndex >= 0) {

                formItemsJson[idx].Subitems.splice(subIndex, 1);
                formItemsJson[idx].Subitems.push(elem.val());
            }

        } else if (type == 6) { //删除当前form元素  在别处已经做了处理了
            formItemsJson.splice(idx, 1);
            //console.log(formItemsJson);
        }
    }

    //console.log(idx);
    //console.log(elem.val());
    //console.log(formItemsJson[idx]);
    //更新dom
    renderFormTpl(idx, 2);
}

var start = '', stop = '', startObj = '';
$("#create-form").sortable({
    placeholder: "hightlight",
    start: function (event, ui) {
        "use strict";
        start = ui.item.index();
        //console.log("start ",start);
        //删除数组中第 start 位置 的对象 保存起来
        startObj = formItemsJson[start];
        formItemsJson.splice(start, 1);

    },
    stop: function (event, ui) {
        "use strict";
        stop = ui.item.index();
        //console.log("stop ",stop);
        //在数组中第 stop 位置 插入start 位置的对象
        formItemsJson.splice(stop, 0, startObj);
        //console.log($("#other_form .form-group").length);
        //数组更新了 重新渲染页面

        var elem = $("#prev_form #other_form").children(".form-group:not(:eq(0))").remove();
        // console.log(elem);
        for (var i = 0; i < formItemsJson.length; i++) {
            (function (i) {
                renderFormTpl(i, 1);
            })(i);
        }
    },
    opacity: 0.8,
    cursor: "move",

    placeholder: 'sotrable-placeholder'
});

    //$("#create-form").disableSelection();
