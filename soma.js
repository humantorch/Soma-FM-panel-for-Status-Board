var SOMA = SOMA || {};

SOMA.Global = (function (window, document, undefined) {

    var self = {

        "datestamp": "",

        "init": function() {
            // Change page background to black if the URL contains "?desktop", for debugging while developing on your computer

            // var station = $("select").val();

            if (document.location.href.indexOf('desktop') > -1) {
                $('#somaContainer').addClass('desktop');
            }

            /* ajax call */
            self.poll($("select").val());

            /* event handlers */
            $("select").one('change', function(event) {
                event.preventDefault();
                // Act on the event
                self.poll($(this).val());
                // window.clearInterval(timer);
                // timer = window.setInterval(function() {self.poll($("select").val());}, 15000);
            });

            var timer = window.setInterval(function() {self.poll($("select").val());}, 15000);
        },

        "poll": function(station) {
            console.log("polling");

            /* variable setup */
            var url = 'proxy.php?url=http%3A%2F%2Fapi.somafm.com%2Fsongs%2F'+station+'.xml',
                $titleSpan = $("#title span"),
                $artistSpan = $("#artist span"),
                $albumSpan = $("#album span");

            $.ajax({
                url: url,
                type: 'get',
                success: function (data) {
                    var xml = data.contents,
                        xmlDoc = $.parseXML(xml),
                        $xml = $(xmlDoc),
                        $nowPlaying = $xml.find('songs song:eq(0)'),
                        $title = $nowPlaying.find('title').text(),
                        $artist = $nowPlaying.find('artist').text(),
                        $album = $nowPlaying.find('album').text(),
                        $datestamp = $nowPlaying.find('date').text();

                    console.log(self.datestamp + " ::: " +$datestamp);

                    if (self.datestamp === "" || self.datestamp !== $datestamp) {
                        console.log("updating!");
                        self.datestamp = $datestamp;
                        $album = $album === '' ? '--' : $album;
                        $titleSpan.text($title);
                        $artistSpan.text($artist);
                        $albumSpan.text($album);
                    }
                },
                complete: function() {
                    console.log(self.datestamp);
                }
            });
        }
    };

    return self;
} (this, this.document));