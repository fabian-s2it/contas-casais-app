
// pesquisa com jquery

var accent_map = {'á':'a','à':'a','â':'a','å':'a','ä':'a','a':'a','ã':'a','ç':'c','é':'e','è':'e','ê':'e','ë':'e','í':'i','ì':'i','î':'i','ï':'i','ñ':'n','ó':'o','ò':'o','ô':'o','ö':'o','õ':'o','ú':'u','ù':'u','û':'u','ü':'u'};         

    String.prototype.replaceEspecialChars = function() {
        var ret = '', s = this.toString();
        if (!s) { return ''; }
        for (var i=0; i<s.length; i++) {
            ret += accent_map[s.charAt(i)] || s.charAt(i);
        }
        return ret;
    };

    String.prototype.contains = function(otherString) {
        return this.toString().indexOf(otherString) !== -1;
    };


    $.extend($.expr[':'], {

        'contains-IgnoreAccents' : function(elemt, idx, math) {
            
            var expression1 = math[3].toLowerCase(),
                semAcent1 = expression1.replaceEspecialChars(),
                expression2 = elemt.innerHTML.toLowerCase(),
                semAcent2 = expression2.replaceEspecialChars();

            return semAcent2.contains(semAcent1);           
        }
});
            



//pesquisa de pedidos
$('.pesquisa-membros input').keyup(function(){

    //tira o case sensitive da pesquisa
    $.expr[":"].contains = $.expr.createPseudo(function(arg) {
        return function( elem ) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });

    //variavel com o nome pesquisado
    pesquisa = $(this).val();
    // alert(pesquisa);

    //sempre que ele apaga o input reseta a lista de msg
    $("#lista-membros li:not('.hide')").show(); 

    //faz sumir todos os que não contem a palavra chave
    if(jQuery.trim(pesquisa) != '') {
        $('#lista-membros li:not(.mensagem-mostra)').hide();
        $("#lista-membros li:contains-IgnoreAccents('" + pesquisa + "')").show();
    }

});


//




function checarLogin() {
    var logado = sessionStorage.getItem('logado');
    console.log('logado: ' + logado);
    if( logado !== '1' ) {
        window.location.href="login.html";
    }
}

function login(){
    var inputSenha = $('.senha').val();

    $.post( "http://requests.digicraft.com.br/login.php", { senha : inputSenha }, function( data ) {
      if( data === 'correto') {
        sessionStorage.setItem('logado', '1');
        window.location.href="index.html";
      } else {
        sessionStorage.setItem('logado', '1');
        window.location.href="index.html";
      }
    }, "json");
}

function carregaEventos() {
    $.getJSON('http://requests.digicraft.com.br/eventos.php', function(data) {
    for(var i = 0; i < data.length; i++) {
        var mes = data[i].data.substring(5,7);
        var nomeMes = '';
        if( mes == 01) { nomeMes = 'Jan'; }
        if( mes == 02) { nomeMes = 'Fev'; }
        if( mes == 03) { nomeMes = 'Mar'; }
        if( mes == 04) { nomeMes = 'Abr'; }
        if( mes == 05) { nomeMes = 'Mai'; }
        if( mes == 06) { nomeMes = 'Jun'; }
        if( mes == 07) { nomeMes = 'Jul'; }
        if( mes == 08) { nomeMes = 'Ago'; }
        if( mes == 09) { nomeMes = 'Set'; }
        if( mes == 10) { nomeMes = 'Out'; }
        if( mes == 11) { nomeMes = 'Nov'; }
        if( mes == 12) { nomeMes = 'Dez'; }
        $('#lista-eventos').append('<li class="abrir-evento" data-id="'+data[i].id+'"><div class="data"><div class="mes">'+nomeMes+'</div><div class="dia">'+data[i].data.substring(8,10)+'</div></div><div class="titulo"><span>'+data[i].titulo+'</span></div></li>');
    }
    $('#lista-eventos li:first-child').prepend('<div class="proximo">Próximo evento:</div>');

        // abre um evento ao clicar na lista
        $('.abrir-evento').click(function(){
            var idEvento = $(this).attr('data-id');
            // $('.ver-evento').animate({'right':'0'},'fast');
            $.getJSON('http://requests.digicraft.com.br/ver-evento.php?id='+idEvento, function(data) {
                $('.ver-evento').html("");
                for(var i = 0; i < data.length; i++) {
                    $('.ver-evento').append('<h1>'+data[i].titulo+'</h1>');
                    $('.ver-evento').append('<p>'+data[i].data+'</p>');
                    $('.ver-evento').append('<h4>'+data[i].descricao+'</h4>');
                    $('.ver-evento').append('<p>'+data[i].texto+'</p>');
                }
                 $('.ver-evento').animate({'margin-right':'0'},'fast');
                 $('.ver-evento-out').fadeIn('fast');
                 $('.close-modal').fadeIn('fast');
                 $('body').addClass('noscroll');
            });
        });

        $('.close-modal').click(function(){
            $('.ver-evento').animate({'margin-right':'-100%'},'fast');
                 $('.ver-evento-out').fadeOut('fast');
                 $('.close-modal').fadeOut('fast');
                 $('body').removeClass('noscroll');
                 $('.ver-evento').html("");
        });

        $('#lista-eventos').fadeIn('fast');
        $('.refresh').removeClass('spin'); 
    });

}



function carregaMembros() {
    $.getJSON('http://requests.digicraft.com.br/listar-membros.php', function(membro) {
    for(var i = 0; i < membro.length; i++) {

        $('#lista-membros').append('<li data-id="'+membro[i].id+'" class="membro'+membro[i].id+'"><div class="nomecompleto" style="display:none">'+membro[i].nome+'</div><img class="foto" src="img/fotos/'+membro[i].foto+'"/><div class="membro-informacoes"><div class="membro-nome">'+membro[i].nome1+' '+membro[i].nome2+'</div><div class="membro-cargo">'+membro[i].cargo+'</div><div class="membro-grau"></div></div><br style="clear:both"></li>');
        
        $("img").error(function () {
          $(this).unbind("error").attr("src", "img/fotos/default.jpg");
        });

        // INICIATICO
        if ( $.inArray('1', membro[i].graus) > -1 ) {
            $('#lista-membros .membro'+membro[i].id+' .membro-grau').append('<img src="img/brasoes/iniciatico.png" height="20" />');
        }

        // DEMOLAY
        if ( $.inArray('2', membro[i].graus) > -1 ) {
            $('#lista-membros .membro'+membro[i].id+' .membro-grau').append('<img src="img/brasoes/demolay.png" height="20" />');
        }

        // CHEVALIER
        if ( $.inArray('3', membro[i].graus) > -1 ) {
            $('#lista-membros .membro'+membro[i].id+' .membro-grau').append('<img src="img/brasoes/chevalier.png" height="20" />');
        }

        // SENIOR
        if ( $.inArray('4', membro[i].graus) > -1 ) {
            $('#lista-membros .membro'+membro[i].id+' .membro-grau').append('<img src="img/brasoes/senior.png" height="20" />');
        }

        // CAVALARIA
        if ( $.inArray('5', membro[i].graus) > -1 ) {
            $('#lista-membros .membro'+membro[i].id+' .membro-grau').append('<img src="img/brasoes/cavalaria.png" height="20" />');
        }

        // CONSELHO CONSULTIVO
        if ( $.inArray('6', membro[i].graus) > -1 ) {
            $('#lista-membros .membro'+membro[i].id+' .membro-grau').append('<img src="img/brasoes/conselho-consultivo.png" height="20" />');
        }

        // CLUBE DE PARENTES
        if ( $.inArray('7', membro[i].graus) > -1 ) {
            $('#lista-membros .membro'+membro[i].id+' .membro-grau').append('<img src="img/brasoes/clube-de-parentes.png" height="20" />');
        }



    }
        $('#lista-membros').fadeIn('fast');
        $('.refresh').removeClass('spin'); 
    });

}



function limpaEventos(){
    console.log("Limpou a lista de eventos.");
    $('#lista-eventos').fadeOut('fast', function(){
        $('#lista-eventos').empty();
    });
}



// muda o icone do menu conforme clica
$('.icon-menu, .menu-out').click(function(){
    if( $('.icon-menu').hasClass('menu-open') ) {
        $('.icon-menu').removeClass('menu-open');

        // fecha o menu
        $('.menu-out').fadeOut('fast');
        $('.menu').animate({'margin-left':'-85%'}, 'fast');
        $('body').removeClass('noscroll');

    } else {
        $('.icon-menu').addClass('menu-open');

        // abre o menu
        $('.menu-out').fadeIn('fast');
        $('.menu').animate({'margin-left':'0'}, 'fast');
        $('body').addClass('noscroll');
    }
});


    $(document).ready(function() {
        console.log('entrou nessa porra');
        document.addEventListener("deviceready", onDeviceReady, false);
    });

    function onDeviceReady(){
        $('.btn-index').hide();
        StatusBar.overlaysWebView(true);
        StatusBar.hide();
        alert('aaaa');
        // document.addEventListener("backbutton", function(e){
        //    window.location.href = 'http://www.google.com'; //Will take you to Google.
        // }, false);
    }
