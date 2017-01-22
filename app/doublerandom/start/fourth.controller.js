var doubleRandomId;
$(function () {
    doubleRandomId = getUrlValue("id");

    console.log(doubleRandomId);

    initPage(0, 10);
});

function initPage(page, size) {
    var url = window.apiPoint + 'double-random-results/doubleRandom';
    console.log(url);
    var dataQuery = {
        page: page,
        size: size,
        doubleRandomId: doubleRandomId
    };
    console.log(dataQuery);
    $.ajax({
        url: url,
        type: 'GET',
        // GET请求传递data
        data: dataQuery,
        async: true,
        dataType: 'json',
        success: function (data, status, xhr) {
            if (data) {
                var totalCount = xhr.getResponseHeader("X-Total-Count");
                var nowpage = parseInt(totalCount / dataQuery.size);
                var result = {};
                result['doubleRandomResults'] = data;
                console.log(data);
                var tpl = [
                    '{@each doubleRandomResults as it,index}',
                    '<tr>',
                    '<td>${it.id}</td>',
                    '<td>${it.companyName}</td>',
                    '<td>${it.companyRegisterId}</td>',
                    '<td>${it.people}</td>',
                    '<td>{@if it.doubleRandom.doubleRandomTaskContent != null }${it.doubleRandom.doubleRandomTaskContent}{@/if}</td>',
                    '<td>{@if it.description != null }${it.description}{@/if}</td>',
                    '<td>',
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
                    url: window.apiPoint + 'double-random-results/' + id,
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