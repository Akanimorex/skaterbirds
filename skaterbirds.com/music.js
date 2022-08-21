$(function () {
    var playerTrack = $("#player-track"),
        bgArtwork = $("#bg-artwork"),
        bgArtworkUrl,
        albumName = $("#album-name"),
        trackName = $("#track-name"),
        albumArt = $("#album-art"),
        sArea = $("#s-area"),
        seekBar = $("#seek-bar"),
        trackTime = $("#track-time"),
        insTime = $("#ins-time"),
        sHover = $("#s-hover"),
        playPauseButton = $("#play-pause-button"),
        i = playPauseButton.find("i"),
        tProgress = $("#current-time"),
        tTime = $("#track-length"),
        seekT,
        seekLoc,
        seekBarPos,
        cM,
        ctMinutes,
        ctSeconds,
        curMinutes,
        curSeconds,
        durMinutes,
        durSeconds,
        playProgress,
        bTime,
        nTime = 0,
        buffInterval = null,
        tFlag = false,
        albums = [
            "Through the Wire",
            "Cloud 9",
            "Ms. Jackson",
            "Telepatia",
            "seaside_demo",
            "Whirlwind Thru Cities",
        ],
        trackNames = [
            "Kanye West",
            "Beach Bunny",
            "OutKast",
            "Kali Uchis",
            "SED",
            "Alfu-Rafa",
        ],
        albumArtworks = ["_1", "_2", "_3", "_4", "_5", "_6"],
        trackUrl = [
            // "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/2.mp3",
            "Music/Through The Wire/throughthewire_kanye_west.mp3",
            "Music/Cloud 9/Cloud 9.mp3",
            "Music/MsJackson/msjackson_by_outkast.mp3",
            "Music/Telepatia/telepatia_by_kali_uchis.mp3",
            "Music/Seaside/Seaside.mp3",
            "Music/Whirlwind/Whirlwind_Thru_Cities_by_Afu-Ra.mp3",
        ],
        playPreviousTrackButton = $("#play-previous"),
        playNextTrackButton = $("#play-next"),
        currIndex = -1,
        compressExpand = $('#compress_expand')
        appCover = $('#app-cover');

    function playPause() {
        setTimeout(function () {
            if (audio.paused) {
                playerTrack.addClass("active");
                albumArt.addClass("active");
                checkBuffering();
                i.attr("class", "fas fa-pause");
                audio.play();
            } else {
                playerTrack.removeClass("active");
                albumArt.removeClass("active");
                clearInterval(buffInterval);
                albumArt.removeClass("buffering");
                i.attr("class", "fas fa-play");
                audio.pause();
            }
        }, 300);
    }

    function showHover(event) {
        seekBarPos = sArea.offset();
        seekT = event.clientX - seekBarPos.left;
        seekLoc = audio.duration * (seekT / sArea.outerWidth());

        sHover.width(seekT);

        cM = seekLoc / 60;

        ctMinutes = Math.floor(cM);
        ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

        if (ctMinutes < 0 || ctSeconds < 0) return;

        if (ctMinutes < 0 || ctSeconds < 0) return;

        if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
        if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

        if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.text("--:--");
        else insTime.text(ctMinutes + ":" + ctSeconds);

        insTime.css({ left: seekT, "margin-left": "-21px" }).fadeIn(0);
    }

    function hideHover() {
        sHover.width(0);
        insTime.text("00:00").css({ left: "0px", "margin-left": "0px" }).fadeOut(0);
    }

    function playFromClickedPos() {
        audio.currentTime = seekLoc;
        seekBar.width(seekT);
        hideHover();
    }

    function updateCurrTime() {
        nTime = new Date();
        nTime = nTime.getTime();

        if (!tFlag) {
            tFlag = true;
            trackTime.addClass("active");
        }

        curMinutes = Math.floor(audio.currentTime / 60);
        curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

        durMinutes = Math.floor(audio.duration / 60);
        durSeconds = Math.floor(audio.duration - durMinutes * 60);

        playProgress = (audio.currentTime / audio.duration) * 100;

        if (curMinutes < 10) curMinutes = "0" + curMinutes;
        if (curSeconds < 10) curSeconds = "0" + curSeconds;

        if (durMinutes < 10) durMinutes = "0" + durMinutes;
        if (durSeconds < 10) durSeconds = "0" + durSeconds;

        if (isNaN(curMinutes) || isNaN(curSeconds)) tProgress.text("00:00");
        else tProgress.text(curMinutes + ":" + curSeconds);

        if (isNaN(durMinutes) || isNaN(durSeconds)) tTime.text("00:00");
        else tTime.text(durMinutes + ":" + durSeconds);

        if (
            isNaN(curMinutes) ||
            isNaN(curSeconds) ||
            isNaN(durMinutes) ||
            isNaN(durSeconds)
        )
            trackTime.removeClass("active");
        else trackTime.addClass("active");

        seekBar.width(playProgress + "%");

        if (playProgress == 100) {
            // i.attr("class", "fa fa-play");
            // seekBar.width(0);
            // tProgress.text("00:00");
            // albumArt.removeClass("buffering").removeClass("active");
            // clearInterval(buffInterval);
            selectTrack(1);
        }
    }

    function checkBuffering() {
        clearInterval(buffInterval);
        buffInterval = setInterval(function () {
            if (nTime == 0 || bTime - nTime > 1000) albumArt.addClass("buffering");
            else albumArt.removeClass("buffering");

            bTime = new Date();
            bTime = bTime.getTime();
        }, 100);
    }

    function selectTrack(flag) {
        if (flag == 0 || flag == 1) ++currIndex;
        else --currIndex;

        if (currIndex > -1 && currIndex < albumArtworks.length) {
            if (flag == 0) i.attr("class", "fa fa-play");
            else {
                albumArt.removeClass("buffering");
                i.attr("class", "fa fa-pause");
            }

            seekBar.width(0);
            trackTime.removeClass("active");
            tProgress.text("00:00");
            tTime.text("00:00");

            currAlbum = albums[currIndex];
            currTrackName = trackNames[currIndex];
            currArtwork = albumArtworks[currIndex];

            audio.src = trackUrl[currIndex];

            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();

            if (flag != 0) {
                audio.play();
                playerTrack.addClass("active");
                albumArt.addClass("active");

                clearInterval(buffInterval);
                checkBuffering();
            }
            console.log(currAlbum.length, 'currAlbum.length')
            if (currAlbum.length > 18) {
                currAlbum = currAlbum.substring(0, 12) + '...'
            }
            if (currTrackName.length > 18) {
                currTrackName = currTrackName.substring(0, 12) + '...'
            }
            albumName.text(currAlbum);
            trackName.text(currTrackName);
            albumArt.find("img.active").removeClass("active");
            $("#" + currArtwork).addClass("active");

            bgArtworkUrl = $("#" + currArtwork).attr("src");

            bgArtwork.css({ "background-image": "url(" + bgArtworkUrl + ")" });
        } else {
            if (flag == 0 || flag == 1) --currIndex;
            else ++currIndex;
        }
    }
    const compressAndExpand = () => {
        if(appCover.hasClass('compress')){
            appCover.removeClass('compress')
            appCover.addClass('expand')
            compressExpand.removeClass('fa-plus')
            compressExpand.addClass('fa-minus')
            setTimeout(() => {
                playerTrack.css({'display': 'block'})
                $('#control-previous').css({'display': 'block'})
                $('#control-next').css({'display': 'block'})
                $('#control-play-pause').removeClass('pen-4')
            }, 200)
        }else{
            appCover.addClass('compress')
            appCover.removeClass('expand')
            compressExpand.removeClass('fa-minus')
            compressExpand.addClass('fa-plus')
            playerTrack.css({'display': 'none'})
            $('#control-previous').css({'display': 'none'})
            $('#control-next').css({'display': 'none'})
            $('#control-play-pause').addClass('pen-4')
        }
    }

    function initPlayer() {
        // playerTrack.css({'display': 'block'})
        audio = new Audio();

        selectTrack(0);

        audio.loop = false;
        audio.volume = 0.5;
        playPauseButton.on("click", playPause);
        // playPauseButton.click()
        sArea.mousemove(function (event) {
            showHover(event);
        });

        sArea.mouseout(hideHover);

        sArea.on("click", playFromClickedPos);

        $(audio).on("timeupdate", updateCurrTime);

        playPreviousTrackButton.on("click", function () {
            if (currIndex === 0) currIndex = 7
            selectTrack(-1);
        });
        playNextTrackButton.on("click", function () {
            if (currIndex === 6) currIndex = -1
            selectTrack(1);
        });
        compressExpand.on('click', compressAndExpand)
    }

    initPlayer();
});
