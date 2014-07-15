var scope = null;

$(function() {
    $('#paper-script').change(refresh);
    $('#refresh').click(refresh);

    $('#pause').click(function() {
        if (!scope) {
            return;
        }

        $(this).toggleClass('active');

        if ($(this).hasClass('active')) {
            scope.project.view.pause();
        } else {
            scope.project.view.play();
        }

        $(this).blur();
    });

    $('#export').click(function() {
        if (!scope) {
            return;
        }

        var svg = scope.project.exportSVG({asString: true});
        this.href = URL.createObjectURL(new Blob([svg], {
            type: 'image/svg+xml'
        }));
        this.download = 'Export_' + timestamp() + '.svg';
    });
});

function timestamp() {
    var parts = new Date().toJSON().toString().replace(/[-:]/g, '').match(
        /^20(.*)T(.*)\.\d*Z$/);
    return parts[1] + '_' + parts[2];
}

function refresh() {
    $('#pause').removeClass('active');
    var selected = $('#paper-script').val();

    if (selected == 'None') {
        if (scope) {
            scope.remove();
            scope = null;
        }
        return;
    }

    var script = 'scripts/' + selected;

    $.ajax({
        url: script,
        type: 'GET',
        dataType: 'text',
        cache: false,
        success: function(data) {
            executeCode(data);
        },
        error: function(xhr, e) {
            alert(e);
        }
    });
}

function executeCode(code) {
    if(scope) {
        scope.remove();
    }

    scope = new paper.PaperScope();

    var includes = [];

    scope.include = function() {
        // Do nothing
    }

    code.replace(
        /(?:^|[\n\r])include\(['"]([^)]*)['"]\)/g,
        function(all, url) {
            includes.push(url);
        }
    );

    function load() {
        var include = includes.shift();
        if (include) {
            var path = 'scripts/' + include;
            $.ajax({
                url: path,
                type: 'GET',
                dataType: 'text',
                success: function(data) {
                    code = data + '\n' + code;
                    load();
                },
                error: function(xhr, e) {
                    console.log("Can't load include file: " + include);
                }
            });
        } else {
            scope.setup($('#main-canvas').get(0));
            scope.execute(code);
        }
    }

    load();
}