/**
 * Created by lilb on 2017/7/13.
 */
var treecol = (function(){
    var Treecol = function(el,nodes){
        this.$el = $(el);
        this.nodes = nodes;
    }
    //排序nodes
    Treecol.prototype.find = function(){
        var arr=[];
        function finditem(id){
            this.nodes.forEach(function(item){
                if(item.parentid==id){
                    arr.push(item);
                    finditem(item.id);
                }
            })
        }
        arr.push(this.nodes[0])
        finditem(this.nodes[0].id);
        this.nodes = arr;
    }
    //确定级别
    Treecol.prototype.ensurelevel = function(parentid){
        var cunt = 0;
        function level(parentid){
            console.log(this.nodes.length)
            if(parentid  == "root"){
                return cunt;
            }else{
                for(var i=0;i<this.nodes.length;i++){
                    if(parentid == this.nodes[i].id){
                        cunt ++;
                        return level(this.nodes[i].parentid );
                    }
                }
            }
        }
        return level(parentid)
    }
    //构建table页面代码
    Treecol.prototype.buildtable = function(){
        this.$el.addClass("table table-bordered table-hover")
            .html('<thead></thead><tbody style="border: solid 2px #ddd"></tbody>')
    }
    //构建tbody页面代码
    Treecol.prototype.buildtbody = function(){
        var htmltbody='';
        function buildtbodyhtml(level,obj){
            var id=obj.id;
            var parentid = obj.parentid;
            var name = obj.name;
            var state = obj.state;
            var option = obj.option;
            var str = '<tr id="'+ id +'" data-parentId="'+ parentid +'"state="'+ state +'">'+
                '<td class="treenode">';
            if(level==0){
                str +=  '<span class="text"> <a href="javascript:;" class="btn btn-default btn-sm Btn">-</a> '+ name +'</span></td>'
            }else{
                for(var i=0;i<(level-1);i++){
                    str+=' <i class="vertical"></i><i class="space"></i>'
                }
                str += '<i class="vertical"></i>'+
                    '<i class="node"></i>'+
                    '<span class="text"> <a href="javascript:;" class="btn btn-default btn-sm Btn">-</a> '+ name +'</span></td>'
            }
            for(var j=0;j<Object.values(option).length;j++){
                str+='<td>'+ Object.values(option)[j] +'</td>'
            }
            str += '</tr>'
            return str
        }
        for(var i=0;i<this.nodes.length;i++){
            var textlevel= this.ensurelevel(this.nodes[i].parentid);
            htmltbody += buildtbodyhtml(textlevel,this.nodes[i])
        }
        this.$el.find("tbody").html(htmltbody)
    }
    //构建thead页面代码
    Treecol.prototype.buildthead = function(){
        function buildtheadhtml(option){
            var str = '<tr><th style="width: 30%"></th>'
            for(var i=0;i<option.length;i++){
                str +=' <th>'+ option[i] +'</th>'
            }
            str +='</tr>'
            return str
        }
        this.$el.find("thead").html(buildtheadhtml(Object.keys(this.nodes[0].option)))
    }
    //初始化节点状态
    Treecol.prototype.initializeState = function(){
        //收起
        function fun_packup(This){
            $(This).html("+")
            var parID = $(This).parent().parent().parent().attr("id");
            var junior = $("tr[data-parentId='"+ parID +"']")
            junior.addClass("hidden").each(function(){
                fun_packup( $(this).find(".Btn"))
            })
        }
        $("tbody tr").each(function(){
            if($(this).attr("state")=="closed"){
                fun_packup($(this).find(".Btn"))
            }
        })
    }
    //绑定事件
    Treecol.prototype.bindEvent = function(){
        //展开
        function unfold(This){
            $(This).html("-")
            var parID = $(This).parent().parent().parent().attr("id");
            $("tr[data-parentId='"+ parID +"']").removeClass("hidden");
            $("tr[data-parentId='"+ parID +"']").each(function(){
                console.log($(this).attr("state"))
                if($(this).attr("state")=="opened"){
                    unfold($(this).find(".Btn"))
                }
            })
        }
        //收起
        function packUp(This){
            $(This).html("+")
            var parID = $(This).parent().parent().parent().attr("id");
            $("tr[data-parentId='"+ parID +"']").addClass("hidden");
            var junior = $("tr[data-parentId='"+ parID +"']")
            junior.each(function(){
                packUp( $(this).find(".Btn"))
            })
        }
        $(".Btn").on("click",function(){
            if($(this).html() == "+"){
                $(this).parent().parent().parent().attr("state","opened");
                unfold(this);
            }else{
                $(this).parent().parent().parent().attr("state","closed");
                packUp(this);
            }
        })
    }
    //隐藏最后一级btn
    Treecol.prototype.Lastbtn = function(){
        $("tbody tr").each(function(){
            if( $("tr[data-parentId='"+ $(this).attr("id") +"']").length > 0){

            }else{
                $(this).find(".Btn").css("display","none")
            }
        })
    }
    Treecol.prototype.init=function(){
        this.find();
        this.buildtable();
        this.buildtbody();
        this.buildthead();
        this.Lastbtn();
        this.initializeState();
        this.bindEvent();
    }
    var init =  function(el,nodes){
        new Treecol(el,nodes).init()
    };
    return {
        init:init
    };
})();
