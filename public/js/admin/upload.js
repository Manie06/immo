(function(document, window) {
    let forms = document.querySelectorAll('.lcUpload__block');
    Array.prototype.forEach.call(forms, function(form) {
        let input        = form.querySelector('input[type="file"]'),
            label        = form.querySelector('label'),
            showFiles    = function(files) {
                label.textContent = files.length > 1 ? ( input.getAttribute('data-multiple-caption') ||'').replace('{count}', files.length ) : files[ 0 ].name;
            };
        input.addEventListener('change', function(e) {
            showFiles(e.target.files);
        }); ['drag','dragstart','dragend','dragover','dragenter','dragleave','drop'].forEach(function(event){
            form.addEventListener(event, function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        form.addEventListener('drop', function(e) {
            input.files = e.dataTransfer.files;
            showFiles(input.files);
        });
    });
}(document, window));