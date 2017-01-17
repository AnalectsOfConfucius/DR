$(function () {
    initPage(0, 10);
    $('.search-action').click(function () {
        initQuery(0, 10);
    });
    $('.add-modal').bind('click', function() {
        $.ajax({
            url: window.apiPoint + 'lawenforce-departments',
            type: 'GET',
            async: true,
            dataType: 'json',
            success: function (data) {
                if (data) {
                    var result= {};
                    result["departments"] = data;
                    var tpl = [
                        '<option></option>',
                        '{@each departments as it,index}',
                        '<option value="${it.id}">${it.departmentName}</option>',
                        '{@/each}'].join('');
                    var html = juicer(tpl, result);
                    $('#addOptionFirst').html(html);
                }
            },
        });
    });
    $('.add-action').bind('click', function () {
        addOne();
    });
});

function initQuery(page, size) {
    var query = $('#query').val();
    if (query == "" || query == null) {
        return;
    }
    console.log(query);
    var dataQuery = {
        page: page,
        size: size,
        query: query,
    };
    $.ajax({
        url: window.apiPoint + '_search/companies',
        type: 'GET',
        // GET请求传递data
        data: dataQuery,
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data) {
                console.log(data.companies);
                var tpl = [
                    '{@each companies as it,index}',
                    '<tr>',
                    '<td>${it.companyRegisterId}</td>',
                    '<td>${it.companyName}</td>',
                    '<td>${it.businessAddress}</td>',
                    '<td>${it.companyOwner}</td>',
                    '<td>${it.companyPhone}</td>',
                    '<td>${it.companySupervisory.departmentName}</td>',
                    '<td>${it.companyStatus}</td>',
                    '<td>{@if it.description != null }${it.description}{@/if}</td>',
                    '<td>',
                    '<a href="javascript:;" data-toggle="modal" data-target="#myModal1">查看</a>',
                    '<a href="javascript:;" data-toggle="modal" data-target="#myModal2">修改</a>',
                    '<a href="javascript:;" onclick="deleteOne(${it.id})">删除</a>',
                    '</td>',
                    '</tr>',
                    '{@/each}'].join('');
                var html = juicer(tpl, data);
                $('#tContent').html(html);
                $("#Pagination").pagination(data.totalPages, {
                    'current_page': dataQuery.page,
                    'callback': pageQuery,
                });
            }
        },
    });
};

function pageQuery(page_index) {
    initQuery(page_index, 10);
};

function initPage(page, size) {
    var dataQuery = {
        page: page,
        size: size
    };
    $.ajax({
        url: window.apiPoint + 'managers',
        type: 'GET',
        // GET请求传递data
        data: dataQuery,
        async: true,
        dataType: 'json',
        success: function (data, status, xhr) {
            if (data) {
                var result = {};
                result['managers'] = data;
                var totalCount = xhr.getResponseHeader("X-Total-Count");
                var nowpage = parseInt(totalCount / dataQuery.size);
                console.log(nowpage);
                var tpl = [
                    '{@each managers as it,index}',
                    '<tr>',
                    '<td>{@if it.managerHNCard != null }${it.managerHNCard}{@/if}</td>',
                    '<td>${it.managerICCard}</td>',
                    '<td>${it.managerName}</td>',
                    '<td>${it.managerSex}</td>',
                    '<td>{@if it.managerLawenforceDepartment != null }${it.managerLawenforceDepartment.departmentName}{@/if}</td>',
                    '<td>{@if it.managerFlag == null }{@else if it.managerFlag == 1 }黑名单{@else}白名单{@/if}</td>',
                    '<td>{@if it.checkCount != null }${it.checkCount}{@/if}</td>',
                    '<td>{@if it.description != null }${it.description}{@/if}</td>',
                    '<td>',
                    '<a href="javascript:;" onclick="detailOne(${it.id})" data-toggle="modal" data-target="#myModal1">查看</a>',
                    '<a href="javascript:;" onclick="updateOne(${it.id})" data-toggle="modal" data-target="#myModal2">修改</a>',
                    '<a href="javascript:;" onclick="deleteOne(${it.id})">删除</a>',
                    '</td>',
                    '</tr>',
                    '{@/each}'].join('');
                var html = juicer(tpl, result);
                $('#tContent').html(html);
                $("#Pagination").pagination(nowpage, {
                    'current_page': dataQuery.page,
                    'callback': pageSelect,
                });
            }
        },
    });
};

function pageSelect(page_index) {
    initPage(page_index, 10);
};

function addOne() {
    var managerName = $("#add").find("input[name=managerName]").val();
    var managerHNCard = $("#add").find("input[name=managerHNCard]").val();
    var managerICCard = $("#add").find("input[name=managerICCard]").val();
    var managerPhone = $("#add").find("input[name=managerPhone]").val();
    var managerSex = $("#add").find("select[name=managerSex]").val();
    var managerFlag = $("#add").find("select[name=managerFlag]").val();
    var description = $("#add").find("textarea[name=description]").val();
    var managerLawenforceDepartmentId = $("#add").find("select[name=managerLawenforceDepartmentId]").val();
    var managerLawenforceDepartment = {id: managerLawenforceDepartmentId};
    var dataPost = {
        managerName: managerName,
        managerHNCard: managerHNCard,
        managerICCard: managerICCard,
        managerSex: managerSex,
        managerFlag: managerFlag,
        managerPhone: managerPhone,
        description: description,
        managerLawenforceDepartment: managerLawenforceDepartment
    };
    console.log(dataPost);
    $.ajax({
        url: window.apiPoint + 'managers',
        type: 'POST',
        // 序列化Json对象为Json字符串
        data: JSON.stringify(dataPost),
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data) {
                initPage(0, 10);
                $('#myModal0').modal('hide');
                $('input[name=reset]').trigger("click");
            }
        },
    });
}

function deleteOne(id) {
    swal({
            title: "您确定要删除这条信息吗",
            text: "删除后将无法恢复，请谨慎操作！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是的，我要删除！",
            cancelButtonText: "让我再考虑一下…",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: window.apiPoint + 'managers/' + id,
                    type: 'DELETE',
                    async: true,
                    dataType: 'json',
                    complete: function (data) {
                        console.log(data);
                        if (data.status == 200 && data.statusText == "OK") {
                            swal("删除成功！", "您已经永久删除了这条信息。", "success");
                            initPage(0, 10);
                        }
                    },
                });
            } else {
                swal("已取消", "您取消了删除操作！", "error");
            }
        });
};

function detailOne(id) {
    $.ajax({
        url: window.apiPoint + 'managers/' + id,
        type: 'GET',
        async: true,
        dataType: 'json',
        success: function (data, status, xhr) {
            if (data) {
                console.log(data);
                $("#detail").find("input[name=managerName]").val(data.managerName);
                $("#detail").find("input[name=managerHNCard]").val(data.managerHNCard);
                $("#detail").find("input[name=managerICCard]").val(data.managerICCard);
                $("#detail").find("input[name=managerPhone]").val(data.managerPhone);
                $("#detail").find("select[name=managerSex]").val(data.managerSex);
                $("#detail").find("select[name=managerFlag]").val(data.managerFlag);
                $("#detail").find("textarea[name=description]").val(data.description);
                $("#detail").find("input[name=managerLawenforceDepartmentId]").val(data.managerLawenforceDepartment.departmentName);
            }
        },
    });
};

function updateOne(id) {
    $.ajax({
        url: window.apiPoint + 'lawenforce-departments',
        type: 'GET',
        async: false,
        dataType: 'json',
        success: function (data) {
            if (data) {
                var result= {};
                result["departments"] = data;
                var tpl = [
                    '<option></option>',
                    '{@each departments as it,index}',
                    '<option value="${it.id}">${it.departmentName}</option>',
                    '{@/each}'].join('');
                var html = juicer(tpl, result);
                $('#updateOptionFirst').html(html);
            }
        },
    });
    $.ajax({
        url: window.apiPoint + 'managers/' + id,
        type: 'GET',
        async: true,
        dataType: 'json',
        success: function (data, status, xhr) {
            if (data) {
                console.log(data);
                $("#update").find("input[name=managerName]").val(data.managerName);
                $("#update").find("input[name=managerHNCard]").val(data.managerHNCard);
                $("#update").find("input[name=managerICCard]").val(data.managerICCard);
                $("#update").find("input[name=managerPhone]").val(data.managerPhone);
                $("#update").find("select[name=managerSex]").val(data.managerSex);
                $("#update").find("select[name=managerFlag]").val(data.managerFlag);
                $("#update").find("textarea[name=description]").val(data.description);
                $("#update").find("select[name=managerLawenforceDepartmentId]").val(data.managerLawenforceDepartment.id);
            }
        },
    });
};