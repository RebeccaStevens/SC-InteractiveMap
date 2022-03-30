import * as config                              from "./Config/index.js"

import * as coreWorker                          from "./CoreWorker/WorkerManager.js";

import BaseLayout                               from './BaseLayout.js';
import GameMap                                  from './GameMap.js';
import SaveParser                               from './SaveParser.js';
import { setupTranslate, translate }            from './Translate.js';

import BaseLayout_Modal                         from './BaseLayout/Modal.js';
import Lib_LeafletPlugins                       from './Lib/LeafletPlugins.js';

export default class SCIM
{
    constructor()
    {
        this.outlineClass               = 'btn-outline-warning focus';

        this.collectedOpacity           = 0.3;

        // Updater notice
        this.scriptsVERSION             = Math.floor(Math.random() * Math.floor(999));
        this.urlScriptsVERSION          = null;
        this.intervalScriptsVERSION     = null;

        // Hold...
        this.map                        = null;
        this.baseLayout                 = null;
    }

    start(remoteUrl)
    {
        if(this.urlScriptsVERSION !== null)
        {
            this.intervalScriptsVERSION = setInterval(this.checkVersion.bind(this), 300 * 1000);
        }

        setupTranslate({
            dataUrl: config.getTranslationDataUrl(),
            callback: () => {
                this.map = new GameMap({
                    build               : config.getBuild(),
                    version             : this.scriptsVERSION,

                    collectedOpacity    : this.collectedOpacity,

                    staticUrl           : config.getStaticAssetsUri(),
                    dataUrl             : config.getMapDataUrl(),

                    language            : config.getLanguage(),
                    remoteUrl           : remoteUrl
                });

                if(window.File && window.FileReader && window.FileList && window.Blob)
                {
                    $('#dropSaveGame').on('drag dragstart dragend dragover dragenter dragleave drop', function(e){e.preventDefault();e.stopPropagation();})
                                      .on('dragover dragenter', function(){$('#dropSaveGame').addClass('is-dragover');})
                                      .on('dragleave dragend drop', function(){$('#dropSaveGame').removeClass('is-dragover');})
                                      .on('drop', function(e){ this.processSaveGameFile(e.originalEvent.dataTransfer.files[0]); }.bind(this));
                    $('#saveGameFileInput').on('change', function(e){
                        let currentFile = $(e.currentTarget).prop('files')[0];
                            $(e.currentTarget).val('');

                        this.processSaveGameFile(currentFile);
                    }.bind(this));
                }
                else
                {
                    $('#dropSaveGame').remove();
                }
            }
        });
    }

    processSaveGameFile(droppedFile)
    {
        if (droppedFile === undefined) {
            alert('Something went wrong reading your save file!');
            return
        }
        if(!droppedFile.name.toLowerCase().endsWith('.sav')){
            alert('File should be name XXX.sav');
            return
        }

        this.showLoader();

        let reader = new FileReader();
        reader.readAsArrayBuffer(droppedFile);
        reader.addEventListener(
            "load",
            () => {
                const task = coreWorker.createTask(
                    {
                        command: "load-save-file",
                        fileName: droppedFile.name,
                        rawData: reader.result,
                    },
                    {
                        transfer: [reader.result],
                    }
                );
                coreWorker.startTask(task, (signal, data) => {
                    switch (signal) {
                        // Data received.
                        case 1:
                            if (Object.hasOwn(data, 'progress')) {
                                this.updateLoaderProgress(data.progress * 0.5);
                            }
                            if (Object.hasOwn(data, 'message')) {
                                $('.loader h6').html(translate(data.message, data.messageReplace));
                            }
                            break;

                        // Task complete.
                        case 2:
                            // TODO: draw map
                            // this.hideLoader();
                            break;
                    }
                });
            },
            {
                once: true,
                passive: true,
            }
        );
    }

    drawNewBaseLayout(options)
    {
        $('#resetPreviousCollected').hide();

        if(this.baseLayout !== null)
        {
            this.baseLayout.reset();
        }

        setTimeout(function(){
            options.build               = config.getBuild();
            options.debug               = config.isDebugMode();
            options.version             = this.scriptsVERSION;

            options.staticUrl           = config.getStaticAssetsUri();
            options.dataUrl             = config.getGameDataUrl();
            options.modsUrl             = config.getModsDataUrl();
            options.tetrominoUrl        = config.getTetrominoUrl();
            options.usersUrl            = config.getUsersUrl();

            options.language            = config.getLanguage();

            options.satisfactoryMap     = this.map;
            options.saveGameParser      = new SaveParser({
                arrayBuffer                 : options.droppedFileResult,
                fileName                    : options.droppedFileName,
                language                    : config.getLanguage(),

                saveParserReadWorker        : config.getSaveParserReadWorkerUrl(),
                saveParserWriteWorker       : config.getSaveParserWriteWorkerUrl()
            });

            this.baseLayout = new BaseLayout(options);
            this.baseLayout.draw();
        }.bind(this), 250);
    }



    showLoader()
    {
        let tips = [
                'You can right click on any foundations and spawn a geometric form around it!',
                'You can right click on any buildings and delete them!',
                'You can right click on any storage container and edit their inventory!',
                'You can right click on a building to update its color!',
                'You can change the color gun slots in the map options...',
            ];

        $('.loader .tips').show();
        $('.loader .tips .speech-bubble em').html(tips[Math.floor(Math.random() * tips.length)]);
        $('.loader h6').html('Loading...');
        $('#dropSaveGame').hide();
        $('#downloadSaveGameModalButton').hide();
        $('#saveGameLoader').show();
        $('.loader').show();
    }

    hideLoader()
    {
        $('.loader').hide();
        $('#saveGameLoader').hide();
        $('#loaderProgressBar').hide();

        if(this.baseLayout !== null)
        {
            $('#downloadSaveGameModalButton').show();
            $('#dropSaveGame small').remove();
        }

        $('#dropSaveGame').show();
    }

    updateLoaderProgress(progress) {
        $('#loaderProgressBar .progress-bar').css('width', (100 * progress) + '%');
    }


    checkVersion(currentVersion)
    {
        let alertMessage = "Good news, a new version of the interactive map was released! Please refresh your page / browser cache to make sure you'll get the latest fixes and features.";

        if(currentVersion !== undefined && currentVersion !== null)
        {
            if(currentVersion > this.scriptsVERSION)
            {
                BaseLayout_Modal.alert(alertMessage);
                return false;
            }
        }
        else
        {
            if(this.urlScriptsVERSION !== null)
            {
                $.get(this.urlScriptsVERSION, function(data){
                    if(data > this.scriptsVERSION)
                    {
                        BaseLayout_Modal.alert(alertMessage);
                        clearInterval(this.intervalScriptsVERSION);
                        return false;
                    }
                }.bind(this));
            }
        }

        return true;
    };
}
window.SCIM = new SCIM();