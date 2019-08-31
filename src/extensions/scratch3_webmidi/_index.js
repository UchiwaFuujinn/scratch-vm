const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');

const Timer = require('../../util/timer');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iSUQwLjA4NjgyNDQzOTAwMDMzODMyIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjQ5MTU0NjY2MDY2MTY5NzQsIDAsIDAsIDAuNDkxNTQ2NjYwNjYxNjk3NCwgLTY0LjUsIC03Ny4yNSkiPjxwYXRoIGlkPSJJRDAuNTcyMTQ2MjMwMzc3MjU2OSIgZmlsbD0iI0ZGOTQwMCIgc3Ryb2tlPSJub25lIiBkPSJNIDE4OCAxNDEgTCAyNTAgMTQxIEwgMjUwIDIwMyBMIDE4OCAyMDMgTCAxODggMTQxIFogIiB0cmFuc2Zvcm09Im1hdHJpeCgxLjI4NzkwMzMwODg2ODQwODIsIDAsIDAsIDEuMjg3OTAzMzA4ODY4NDA4MiwgLTExMC45LCAtMjQuNCkiLz48cGF0aCBpZD0iSUQwLjYzODMzNjEzNTA3NDQ5NjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTk2IDIwNCBDIDE5NiAyMDQgMTkyLjcwNiAxOTAuMDU4IDE5MyAxODMgQyAxOTMuMDc0IDE4MS4yMzYgMTk1Ljg4NiAxNzguNDU4IDE5NyAxODAgQyAyMDEuNDU1IDE4Ni4xNjggMjAzLjQ0MyAyMDMuNzU0IDIwNiAyMDEgQyAyMDkuMjExIDE5Ny41NDIgMjEwIDE2NiAyMTAgMTY2ICIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgLTU3LCAxNS44KSIvPjxwYXRoIGlkPSJJRDAuNzU4NzMwMzU2NTgxNTA5MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTSAyMTUgMTY5IEMgMjE1IDE2OSAyMTguMzY3IDE2OS41MzQgMjIwIDE3MCBDIDIyMC43MTYgMTcwLjIwNSAyMjEuMjc4IDE3MC44MTkgMjIyIDE3MSBDIDIyMi42NDYgMTcxLjE2MiAyMjMuMzY4IDE3MC43ODkgMjI0IDE3MSBDIDIyNC40NDcgMTcxLjE0OSAyMjUgMTcyIDIyNSAxNzIgIiB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLCAwLCAxLCAtNTcsIDE1LjgpIi8+PHBhdGggaWQ9IklEMC4yNDM2NzMwNzMxMjc4NjU4IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNIDIyNyAxNTQgQyAyMjcgMTU0IDIxOC41NTUgMTQ3Ljg5MCAyMTcgMTUxIEMgMjEyLjM0NSAxNjAuMzEwIDIxMS4yODkgMTcxLjczMyAyMTMgMTgyIEMgMjEzLjYxMiAxODUuNjcyIDIyMyAxODcgMjIzIDE4NyAiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIC01NywgMTUuOCkiLz48cGF0aCBpZD0iSUQwLjc5MzkzOTQ4MTk1NTAyMTYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTc1IDIwMC41MDAgQyAxNzUgMjAwLjUwMCAxNjkuODA1IDIyMS45MTMgMTcxIDIyMi43NTAgQyAxNzIuMTk1IDIyMy41ODcgMTc4Ljc5NSAyMDUuMjk1IDE4Mi41MDAgMjA1Ljc1MCBDIDE4NS45MjAgMjA2LjE3MCAxODEuODU5IDIyNC41MDAgMTg1LjI1MCAyMjQuNTAwIEMgMTg5LjIxMyAyMjQuNTAwIDE5Ny4yNTAgMjA1Ljc1MCAxOTcuMjUwIDIwNS43NTAgIi8+PC9nPjwvc3ZnPg==';

/**
 * Enum for eventl ist parameter values.
 * @readonly
 * @enum {string}
 */
/*const EventList = {
	"key on",
   	"key off",
   	"cc-chg",
   	"p-bend",
	"pg-chg"
};*/

const EventList = {
    KEY_ON:	'key-on',
    KEY_OF:	'key-of',
    CC_CHG: 'cc-chg',
    P_BEND: 'p-bend',
	PG_CHG:	'pg-chg'
};

function rest_time_wait(irticks)
{
	var iCount = mCount;
	var itimer = setInterval(function(){
		var dcount = mCount-iCount;
		if ( dcount<0 ) dcount =dcount + mResolution*4;
		if( dcount >= irticks){
			clearInterval(itimer);
			s_RestTicks();
		}
	} , mBaseCount);
}

/**
 * Class for the new blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3WebMIDI {

    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

		/* for MIDI Ebvent */
		this.mMIDI	= null;
		this.mInputs =null;
		this.mOutputs=null;

		this.mCtlbuf = new Array(0x80);
		this.mNoteOn = new Array(0x80);

		this.mCC_change_event=false
		this.mMIDI_event	= false;
		this.mKey_on_event	= false;
		this.mKey_off_event	= false;
		this.mPBend_event	= false;
		this.mPC_event		= false;

		this.mCC_change_flag= false;
		this.mKey_on_flag 	= false;
		this.mKey_off_flag 	= false;
		this.mPC_flag		= false;
		this.mPBend_flag	= false;

		this.mNoteNum	= 0;
		this.mNoteVel	= 0;
		this.mNoteBuf	= 0;
		this.mPBend		= 64;
		this.mPCn		= 0;

/* -------------------------------------------------------------------------	*/
		this.mCount		= 0;
		this.mBeat		= 0;
		this.mDticks	= 1;
		this.mTempo		= 120;

		this.mBaseCount		=4;
		this.mResolution	= 480;

/* -------------------------------------------------------------------------	*/
		navigator.requestMIDIAccess().then( this._success, this._failure );

/* -------------------------------------------------------------------------	*/
		this.mTimer = setInterval(function(){
			this.mDticks= this.mTempo*this.mResolution/60000;
			this.mCount	= this.mCount+this.mDticks*this.mBaseCount;
			this.mBeat	= this.mBeat+this.mDticks*this.mBaseCount;
			if(this.mCount>this.mResolution*4){
				this.mCount = this.mCount - this.mResolution*4;
			}
		} , this.mBaseCount);
    }

	_success(midiAccess)
	{
		this.mMIDI=midiAccess;

		for(var i=0; i<0x80; i++){
			this.mCtlbuf[i]=0;
			this.mNoteOn[i]=0;
		}

		if (typeof this.mMIDI.inputs === "function") {
			this.mInputs  =	this.mMIDI.inputs();
			this.mOutputs =	this.mMIDI.outputs();
		} else {
			var inputIterator = this.mMIDI.inputs.values();
			this.mInputs = [];
			for (var o = inputIterator.next(); !o.done; o = inputIterator.next()) {
				this.mInputs.push(o.value)
			}
			var outputIterator = this.mMIDI.outputs.values();
			this.mOutputs = [];
			for (var o = outputIterator.next(); !o.done; o = outputIterator.next()) {
				this.mOutputs.push(o.value)
			}
		}
		for(var i=0; i<mInputs.length;i++){
			this.mInputs[i].onmidimessage=this._m_midiin;
		}
		alert( "Success MIDI!" );
	}

	failure(error)
	{
		alert( "Failed MIDI!" + error );
	}

	/* MIDI parse */
	_m_midiin(event){
		switch(event.data[0]&0xF0){
			case 0x80:
				this.mMIDI_event=true;
				this._m_noteon(event.data[1],0);
				break;
			case 0x90:
				this.mMIDI_event=true;
				this._m_noteon(event.data[1],event.data[2]);
				break;
			case 0xA0:
				break;
			case 0xB0:
				this.mMIDI_event=true;
				this.mCC_change_event=true;
				this.mCC_change_flag=true;
				this.mCtlbuf[event.data[1]]=event.data[2];
				break;
			case 0xC0:
				this.mMIDI_event=true;
				this.mPC_event=true;
				this.mPC_flag=true;
				this.mPCn=event.data[1];
				break;
			case 0xD0:
				break;
			case 0xE0:
				this.mMIDI_event=true;
				this.mPBend_event=true;
				this.mPBend_flag=true;
				this.mPBend=event.data[2];
				break;
			case 0xF0:
				break;
		}
	}

	_m_noteon(note, vel)
	{
		this.mNoteNum=note;
		this.mNoteVel=vel;

		if(vel>0){
			this.mKey_on_event	= true;
			this.mKey_on_flag	= true;
			this.mNoteOn[mNoteNum]= true;
		} else {
			this.mKey_off_event	= true;
			this.mKey_off_flag	= true;
		}
	}


	_m_midiout(event, note, vel)
	{
		var data1=event&0xFF;
		var data2=note&0x7F;
		var data3=vel&0x7F;

		if(this.mOutputs!=null){
			for(var i=0; i<this.mOutputs.length; i++){
				var l_output=this.mOutputs[i];
				if(l_output!=null){
					l_output.send([data1,data2,data3], 0);
				}
			}
		}
	}

/* -------------------------------------------------------------------------	*/
    /**
     * @returns {object} metadata for this extension and its blocks.
     */
	getInfo () {
		return {
			id: 'webmidi',
//			name: 'Web MIDI for Scratch3',

            name: formatMessage({
                id: 'Web MIDI for Scratch3',
                default: 'Web MIDI',
                description: 'Label for the web midi extension category'
            }),

			menuIconURI: menuIconURI,
			blockIconURI: blockIconURI,

			blocks: [
				{
					opcode: 's_Note',
					text: 'NoteNum',
					blockType: BlockType.REPORTER
				},

				{
					opcode: 's_Vel',
					text: 'Velocity',
					blockType: BlockType.REPORTER
				},

				{
					opcode: 's_PBend',
					text: 'PB',
					blockType: BlockType.REPORTER
				},

				{
					opcode: 's_PChange',
					text: 'PC',
					blockType: BlockType.REPORTER
				},

				{
					opcode: 's_Ticks',
					text: 'Ticks',
					blockType: BlockType.REPORTER
				},

				{
					opcode: 's_Ccin',
					text: formatMessage({
						id: 'webmidi.s_Ccin',
						default: 'CC [ccnum]',
						description: 'Control Change Value'
					}),
					blockType: BlockType.REPORTER,
					arguments: {
						ccnum: {
							type: ArgumentType.NUMBER,
							defaultValue: 1
						}
					}
				},

				{
					opcode: 's_Getmidievent',
					text: 'MIDI EVENT',
					blockType: BlockType.HAT,
				},

				{
					opcode: 's_Getkeyon',
					text: 'Key ON',
					blockType: BlockType.HAT,
				},

				{
					opcode: 's_Getkeyoff',
					text: 'Key OFF',
					blockType: BlockType.HAT,
				},

				{
					opcode: 's_PBevent',
					text: 'P.Bend',
					blockType: BlockType.HAT,
				},

				{
					opcode: 's_PCevent',
					text: 'PrgChg',
					blockType: BlockType.HAT,
				},

				{
					opcode: 's_Getcc',
					text: 'CtrlChg',
					blockType: BlockType.HAT,
				},

				{
					opcode: 's_Getkeyonnum',
					text: formatMessage({
						id: 'webmidi.s_Getkeyonnum',
						default: 'KEY ON [ckeynum]',
						description: 'Note Number'
					}),
					blockType: BlockType.HAT,
					arguments: {
						ckeynum: {
							type: ArgumentType.NUMBER,
							defaultValue: 1
						}
					}
				},

				{
					 opcode: 's_Event',
						text: formatMessage({
							id: 'webmidi.s_Event',
							default: 'EVENT [n_event]',
							description: 'any events recieved?'
						}),
					blockType: BlockType.BOOLEAN,
					arguments: {
						n_event: {
							type: ArgumentType.STRING,
							menu: 'eventlist',
							defaultValue: EventList.KEY_ON
						}
					}
				},

				{
					opcode: 's_Noteon_out',
					text: formatMessage({
						id: 'webmidi.noteon_out',
						default: 'NOTE ON [channelnum][notenum][velo]',
						description: 'send note on'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						channelnum: {
							type: ArgumentType.NUMBER,
							defaultValue: 1
						},
						notenum: {
							type: ArgumentType.NUMBER,
							defaultValue: 60
						},
						velo: {
							type: ArgumentType.NUMBER,
							defaultValue: 127
						}
					}
				},

				{
					opcode: 's_Noteoff_out',
					text: formatMessage({
						id: 'webmidi.noteoff_out',
						default: 'NOTE OFF [channelnum][notenum][velo]',
						description: 'send note off'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						channelnum: {
							type: ArgumentType.NUMBER,
							defaultValue: 1
						},
						notenum: {
							type: ArgumentType.NUMBER,
							defaultValue: 60
						},
						velo: {
							type: ArgumentType.NUMBER,
							defaultValue: 127
						}
					}
				},

				{
					opcode: 's_RestTicks',
					text: formatMessage({
						id: 'webmidi.rest_tickes',
						default: 'Rest [rticks] tickes',
						description: 'rest some tickes'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						rticks: {
							type: ArgumentType.NUMBER,
							defaultValue: 240
						},
					}
				},

				{
					opcode: 's_GetBeat',
					text: formatMessage({
						id: 'webmidi.s_GetBeat',
						default: 'BEAT [tempo]',
						description: 'Tempo'
					}),
					blockType: BlockType.HAT,
					arguments: {
						tempo: {
							type: ArgumentType.NUMBER,
							defaultValue: 120
						}
					}
				},

			],
            menus: {
                eventlist: {
                    acceptReporters: true,
                    items: this._initEventList()
                }
            }
		};
	}

   /**
     * Initialize color parameters menu with localized strings
     * @returns {array} of the localized text and values for each menu element
     * @private
     */
    _initEventList () {
        return [
            {
                text: formatMessage({
                    id: 'webmidi.eventlist.key-on',
                    default: 'key-on',
                    description: 'label for event for webmidi extension'
                }),
                value: EventList.KEY_ON
            },
            {
                text: formatMessage({
                    id: 'webmidi.eventlist.key-of',
                    default: 'key-of',
                    description: 'label for event for webmidi extension'
                }),
                value: EventList.KEY_OF
            },
            {
                text: formatMessage({
                    id: 'webmidi.eventlist.cc-chg',
                    default: 'cc-chg',
                    description: 'label for event for webmidi extension'
                }),
                value: EventList.CC_CHG
            },
            {
                text: formatMessage({
                    id: 'webmidi.eventlist.p-bend',
                    default: 'p-bend',
                    description: 'label for event for webmidi extension'
                }),
                value: EventList.P_BEND

            },
			{
                text: formatMessage({
                    id: 'webmidi.eventlist.pg-chg',
                    default: 'pg-chg',
                    description: 'label for event for webmidi extension'
                }),
                value: EventList.PG_CHG

            }
        ];
    }

	/**
		* Write log.
		* @param {object} args - the block arguments.
		* @property {number} TEXT - the text.
	*/
	writeLog (args) {
		const text = Cast.toString(args.TEXT);
		log.log(text);
	}

	/**
		* Get the browser.
		* @return {number} - the user agent.
	*/
	getBrowser () {
		return navigator.userAgent;
	}

/* -------------------------------------------------------------------------	*/
// GET NOTE ON/OFF
	s_Getmidievent() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (this.mMIDI_event == true) {
			this.mMIDI_event = false;
			return true;
       }
       return false;
	}

//Set Note Number
	s_Note() {
		return (this.mNoteNum);
	}

//Set Note Vel
	s_Vel() {
		return (this.mNoteVel);
	}

// GET KEY ON
	s_Getkeyon() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (this.mKey_on_event == true) {
			this.mKey_on_event = false;
			return true;
       }
       return false;
	}

// GET KEY ON with keynumber
	s_Getkeyonnum(args) {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (this.mNoteOn[args.ckeynum] == true) {
			this.mNoteOn[args.ckeynum] = false;
			return true;
       }
       return false;
	}

// GET KEY OFF
	s_Getkeyoff() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (this.mKey_off_event == true) {
			this.mKey_off_event = false;
			return true;
       }
       return false;
	}

/* -------------------------------------------------------------------------	*/
// GET CC
	s_Getcc() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (this.mCC_change_event === true) {
			this.mCC_change_event = false;
			return true;
       }
       return false;
	}


// Set CC Value
// ccnum: Control Change Number
	s_Ccin(args) {
		return (this.mCtlbuf[args.ccnum]);
	}

/* -------------------------------------------------------------------------	*/
//Set PitchBend
	s_PBevent() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (this.mPBend_event == true) {
			this.mPBend_event = false;
			return true;
       }
       return false;
	}

//Set PitchBend Valuel
	s_PBend() {
		return (this.mPBend);
	}

/* -------------------------------------------------------------------------	*/
//Set Program Change Event
	s_PCevent() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (this.mPC_event == true) {
			this.mPC_event = false;
			return true;
       }
       return false;
	}

//Set Program Change
	s_PChange() {
		return (this.mPCn);
	}

/* -------------------------------------------------------------------------	*/
//Event
	s_Event(args) {
		var n_flag=false;

		switch(args.n_event){
			case EventList.KEY_ON:
			{
				if (mKey_on_flag == true) {
					n_flag = true;
					this.mKey_on_flag =false;
       			}
			}
			break;

			case EventList.KEY_OF:
			{
				if (this.mKey_off_flag == true) {
					n_flag = true;
					this.mKey_off_flag =false;
       			}
			}
			break;

			case EventList.CC_CHG:
			{
				if (this.mCC_change_flag == true) {
					n_flag = true;
					this.mCC_change_flag =false;
       			}
			}
			break;

			case EventList.P_BEND:
			{
				if (this.mPBend_flag == true) {
					n_flag = true;
					this.mPBend_flag =false;
       			}
			}
			break;

			case EventList.PG_CHG:
			{
				if (this.mPC_flag == true) {
					n_flag = true;
					this.mPC_flag =false;
       			}
			}
			break;
		}
		return n_flag;
	}

/* -------------------------------------------------------------------------	*/
//NOTE ON
	s_Noteon_out(args){
		var chnum = (args.channelnum&0x0F)-1;
		return this._m_midiout(0x90+chnum,args.notenum&0x7F,args.velo&0x7F);
	}

//NOTE OFF
	s_Noteoff_out(args){
		var chnum = (args.channelnum&0x0F)-1;
		return this._m_midiout(0x80+chnum,args.notenum&0x7F,args.velo&0x7F);
	}


/* -------------------------------------------------------------------------	*/
/*var mCount = 0;
var mTimer = setInterval(function(){
//		clearInterval(id);　//idをclearIntervalで指定している
		mCount++;
	}
	}, 20);
*/

// Beat
	s_GetBeat(args) {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		this.mTempo = args.tempo;

		if (this.mBeat >= this.mResolution) {
			this.mBeat = this.mBeat-this.mResolution;
			return true;
       }
       return false;
	}

	s_Ticks(){
		return (Math.floor(this.mCount));
	}

    /**
     * Rest for some number of beats.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     * @property {number} BEATS - the duration in beats of the rest.
     */
	s_RestTicks(args, util) {
		var iCount = this.mCount;

        if (this._stackTimerNeedsInit(util)) {
            let irticks = args.rticks;
            beats = this._clampBeats(beats);
            this._startStackTimer(util, this._beatsToSec(beats));
        } else {
            this._checkStackTimer(util);
        }
    }

/* -------------------------------------------------------------------------	*/
    /**
     * Check if the stack timer needs initialization.
     * @param {object} util - utility object provided by the runtime.
     * @return {boolean} - true if the stack timer needs to be initialized.
     * @private
     */
    _stackTimerNeedsInit (util) {
        return !util.stackFrame.timer;
    }

    /**
     * Start the stack timer and the yield the thread if necessary.
     * @param {object} util - utility object provided by the runtime.
     * @param {number} duration - a duration in seconds to set the timer for.
     * @private
     */
    _startStackTimer (util, duration) {
        util.stackFrame.timer = new Timer();
        util.stackFrame.timer.start();
        util.stackFrame.duration = duration;
        util.yield();
    }

    /**
     * Check the stack timer, and if its time is not up yet, yield the thread.
     * @param {object} util - utility object provided by the runtime.
     * @private
     */
    _checkStackTimer (util) {
        const timeElapsed = util.stackFrame.timer.timeElapsed();
        if (timeElapsed < util.stackFrame.duration * 1000) {
            util.yield();
        }
    }

}
module.exports = Scratch3WebMIDI;
