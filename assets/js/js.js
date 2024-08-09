$(document).ready(function() {
    var viewportWidth = $(window).width();

    $(function() {
        // Prepare extra handles
        var nw = $("<div>", {
            class: "ui-rotatable-handle"
        });
        var ne = nw.clone();
        var se = nw.clone();
        
        // Assign Draggable
        if (viewportWidth < 900) {    
            $('.box-wrapper').draggable({
                cancel: ".ui-rotatable-handle",
                scroll: false,
                containment: "#imageContainer",
                start: function(event, ui) { $('body').css('overflow','hidden');},
                stop: function(event, ui) { $('body').css('overflow','auto');}
            });
        } else {
            $('.box-wrapper').draggable({
                cancel: ".ui-rotatable-handle",
                scroll: false,
                containment: "#imageContainer"
            });
        }

        // Assign Rotatable
        $('.box').resizable({aspectRatio: true,containment: "#imageContainer"}).rotatable();

        // Assign coordinate classes to handles
        $('.box div.ui-rotatable-handle').addClass("ui-rotatable-handle-sw");
        nw.addClass("ui-rotatable-handle-nw");
        ne.addClass("ui-rotatable-handle-ne");
        se.addClass("ui-rotatable-handle-se");

        // Assign handles to box
        $(".box").append(nw, ne, se);

        // Assigning bindings for rotation event
        $(".box div[class*='ui-rotatable-handle-']").bind("mousedown", function(e) {
            $('.box').rotatable("instance").startRotate(e);
        });
    });

    // CHANGE GOGGLE TYPE
    $('.goggles').on('click', function() {
        $('.goggles').removeClass('active');
        var goggles = $(this).attr('src');
        $('.box').css('background-image', 'url(' + goggles + ')');
        $(this).addClass('active');
    });

    // UPLOAD IMAGE INTO CANVAS
    $('#uploadImage').change(function() {
        var file = URL.createObjectURL(this.files[0]);
        $('#imageContainer').css('background-image', 'url(' + file + ')');
    });

    // SAVE CANVAS AS IMAGE AND AUTO-DOWNLOAD
    $('#saveButton').click(function() {
        $('#loading').css('opacity', '1');
        $('#saveButton').html('Generating...');
        $('.ui-rotatable-handle').hide();
        $('.ui-icon').hide();
        var element = $('#imageContainer')[0];
        html2canvas(element, {allowTaint: false, scale: 2, width: $(element).width(), height: $(element).height()}).then(function(canvas) {
            
            newWidth = canvas.width - 4;
            newHeight = canvas.height - 4;

            const newCanvas = document.createElement('canvas');
            newCanvas.width = newWidth;
            newCanvas.height = newHeight;

            newCanvas.getContext('2d').drawImage(canvas, 0, 0, newWidth, newHeight, 0, 0, newWidth, newHeight);
            
            var imageData = newCanvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");

            $.ajax({
                url: "https://minion-backend-880c3b0ca52b.herokuapp.com/upload",
                data: { imgBase64: newCanvas.toDataURL("image/jpeg") },
                type: "POST",
                success: function() {
                    $('#loading').css('opacity', '0');
                    loadGallery(); // Reload gallery after successful upload
                    $('.ui-rotatable-handle').show();
                    $('.ui-icon').show();
                    $('#saveButton').html('Save Image');
                    
                    var a = document.createElement('a');
                    a.href = imageData;
                    a.download = 'Jesus-Minion-pfp.jpg';
                    a.click();
                },
                error: function() {
                    $('#loading').css('opacity', '0');
                    $('.ui-rotatable-handle').show();
                    $('.ui-icon').show();
                    $('#saveButton').html('Save Image');
                    alert('Failed to save image.');
                }
            });
        });
    });

    // Function to load gallery
    function loadGallery() {
        fetch('https://minion-backend-880c3b0ca52b.herokuapp.com/gallery')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(files => {
                const gallery = document.getElementById('gallery');
                if (files.length > 0) {
                    const imageList = files.filter(file => file !== '.gitkeep').map(file => `<img src="https://minion-backend-880c3b0ca52b.herokuapp.com/images/${file}" alt="${file}" style="width: 100px; height: auto;">`).join('');
                    gallery.innerHTML = imageList;
                } else {
                    gallery.innerHTML = '<p>No images found.</p>';
                }
            })
            .catch(error => {
                console.error('Error loading gallery:', error);
                const gallery = document.getElementById('gallery');
                gallery.innerHTML = '<p>Error loading gallery. Please try again later.</p>';
            });
    }

    loadGallery(); // Initial load
});
