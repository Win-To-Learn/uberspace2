var editor,
	defaultCode;

(function($){

    // Initialize editor on #editor div
    editor = ace.edit("editor");
    var session = editor.getSession();
    editor.setTheme("ace/theme/monokai");
    session.setMode("ace/mode/javascript");

    var tabOpen = false;
    var editorHeight = 430;
    var $codeArea = $('#codeArea');
    var $editorTab = $('#editorTab');
    var $submitCode = $('#submitCode');
    var $resetCode = $('#resetCode');
	
	defaultCode = editor.getValue();
	if(typeof(Storage) !== "undefined" && localStorage.getItem("code") !== "") {
		editor.setValue(localStorage.getItem("code"));
	}

    $editorTab.click(function(){
        tabOpen ? closeTab() : openTab();
        tabOpen = !tabOpen;
        $codeArea.toggleClass('open', tabOpen);
    });

    $submitCode.click(function(){
		var newCode = editor.getValue();
		var data = eval('(function(){'+newCode+'}())');
		if(data !== undefined) {
			send(data);
		}
    });
	
	function send(data) {
		console.log("Sent "+data);
		if(typeof(data)=="string"){data={'command':data};}
		if(Shooter.$.conn) {
			Shooter.$.conn.send(BISON.encode(data));
		}
	}
	
	$resetCode.click(function(){
		editor.setValue(defaultCode);
	});
	
	editor.on("change", function() {
		if(typeof(Storage) !== "undefined") {
			localStorage.setItem("code", editor.getValue());
		}
	});

    function closeTab() {
        $codeArea.stop().animate({
            bottom: -editorHeight
        });
    }

    function openTab() {
        $codeArea.stop().animate({
            bottom: 0
        });
    }

})(jQuery);