var noSleep = new NoSleep();

var synth = new Tone.Synth().toMaster();
//synth.envelope.attack = 0.0;
//synth.envelope.decay = 0.5;
//synth.envelope.sustain = 1;
//synth.envelope.release = 0.3;
synth.oscillator.type = 'sine';

var my_click = new Tone.NoiseSynth().toMaster();
//  "volume" : -10,
//  "type" : "brown"
//}).toMaster();

my_click.volume = 1;
my_click.noise.type = "white";
//my_click.envelope.attack = 0;
//my_click.envelope.decay = 0.04;
//my_click.envelope.sustain = 0;
console.log(my_click);

Tone.Transport.scheduleRepeat(function(time) {
  vm.time_inc();
}, '2n');


var vm = new Vue({
  el: '#app',
  data: {
    records: blade_records,
    current_sequence: null,
    current_sequence_indx: 0,
    sequence_rack_indx: 0,
    start_action: 0,
    home_page: true,
    auto_run: false,
    sequence_rack: [],
    sequence_bookmarks: [],
    running: false,

},
methods: {
  main_menu: function(seq) {
    this.home_page = true;
  },
  show_sequence: function(seq) {

        noSleep.enable();

        this.current_sequence_indx = 0;
        this.sequence_rack_indx = 0;
        this.start_action = 0;
        this.home_page = true;
        this.auto_run = false;
        this.sequence_rack = [];
        this.sequence_bookmarks = [];
        this.running = false;


        this.current_sequence = seq;
    this.auto_run = seq.autorun;
    this.create_sequence_actions(seq.actions);
    this.home_page = false;
  },
  create_sequence_actions: function(actions) {
    this.stop_clk();
    this.sequence_bookmarks = [];
    this.sequence_rack_indx = 0;

    var note = null;


    for (var action_indx in actions) {

      if(action_indx < this.start_action ){ continue;}

      var row = actions[action_indx];
      var next_exercise = "Last one";

      if(typeof actions[parseInt(action_indx)+1] !== 'undefined') {
        next_exercise = actions[parseInt(action_indx)+1].action_type + ": " + actions[parseInt(action_indx)+1].title;


      }


      var side_loop = row.side === 'lr' ? 2 : 1;
      action_indx = parseInt(action_indx);

      this.sequence_bookmarks[action_indx] = this.sequence_rack.length;

      for (var cur_rep = 1; cur_rep <= (side_loop * row.reps); cur_rep++ ) {
        for (var rest_cnt = row.rest; rest_cnt > -1; rest_cnt--) {
          note = null;
          note = rest_cnt < 4 ? 'C6' : note;
          note = rest_cnt === 0 ? 'C5' : note;



          this.sequence_rack.push({
            'second': rest_cnt, 'state': 'rest', 'img': row.img,
            'title': row.title,
            'action_type' : row.action_type,
            'next_exer': next_exercise,
            'reps': row.reps,
            'description': row.description,
            'cur_rep': cur_rep,
            'note' : note,
            'cur_seq' : action_indx,
            'tot_seq' : actions.length,
            'last_seq' : false,
            'bands' : [row.band_a, row.band_b, row.band_c],
            'side' : row.side,
          });
        }

        for (var active_cnt=row.active; active_cnt > -1; active_cnt--) {
          note = null;
          note = active_cnt < 4 ? 'C6' : note;
          note = active_cnt === 0 ? 'C5' : note;

          this.sequence_rack.push({
            'second': active_cnt, 'state': 'active', 'img': row.img,
            'title': row.title,
            'action_type' : row.action_type,
            'next_exer': next_exercise,
            'reps': row.reps,
            'description': row.description,
            'cur_rep': cur_rep,
            'note' : note,
            'cur_seq' : action_indx,
            'tot_seq' : actions.length,
            'last_seq' : false,
            'bands' : [row.band_a, row.band_b, row.band_c],
            'side' : row.side,
          });
        }
      }


      if(!this.auto_run) {
        this.sequence_rack.push({
          'second'  : 0,
          'state'   : 'active',
          'img'     : row.img,
          'title'     : row.title,
          'next_exer': next_exercise,
          'reps': row.reps,
          'description': row.description,
          'cur_seq' : action_indx,
          'tot_seq' : actions.length,
          'note'    : null,
          'cur_seq' : action_indx,
          'last_seq': true,
          'bands' : [row.band_a, row.band_b, row.band_c],
          'side' : row.side,
        });
      }
    }


  },
  start_clk: function() {
    Tone.Transport.start();
    this.running = true;
  },
  stop_clk: function() {
    Tone.Transport.stop();
    this.running = false;
  },
  time_inc: function() {
    this.sequence_rack_indx++;
  },
  update_from_seq : function(frame) {
    if(typeof(frame) === 'undefined' ) {
      this.stop_clk();
      this.sequence_rack_indx = 0;
      return;
    }

    this.current_sequence_indx = frame.cur_seq;
    if(frame.last_seq && !this.auto_run){
      this.stop_clk();
      this.time_inc();
    }


  },
  move_to_seq : function(factor) {
    this.stop_clk();
    var targ_seq = this.show_frame.cur_seq + factor;
    targ_seq = targ_seq <= 0 ? 0 : targ_seq;
    if(typeof(this.sequence_bookmarks[targ_seq]) === 'undefined'){
      targ_seq--;
    }

    this.sequence_rack_indx = this.sequence_bookmarks[targ_seq];
   if(this.auto_run){
     this.start_clk();
   }


  },
},
mounted() {

},
computed: {
  show_frame: function() {
    this.update_from_seq(this.sequence_rack[this.sequence_rack_indx]);
    var frame_obj = this.sequence_rack[this.sequence_rack_indx];
    if(typeof frame_obj === 'undefined') {
      this.stop_clk();
      this.home_page = true;
      return;

    }

    frame_obj.prog = this.sequence_rack_indx+'/'+this.sequence_rack.length;
    frame_obj.over_prog = (1 + parseInt(frame_obj.cur_seq)) + ' / ' + frame_obj.tot_seq;
    console.log(frame_obj.note);

    if(this.running && null !== frame_obj.note) {
     synth.triggerAttackRelease(frame_obj.note, "32n");
     //console.log('NOTE PLAYED', frame_obj.note);
   } else {

      //my_click.triggerAttackRelease('32n');
    }


    return frame_obj;
  },
  program: function() {
    if(typeof this.sequence_rack[this.sequence_rack_indx] === 'undefined') {
      console.log('DONNNNNNE 2');
      return;

    }

    var state = this.sequence_rack[this.sequence_rack_indx].state;
    if(this.running === false){
      return '';
    } else {
      return state;
    }

  },
  form_sec: function() {
var ldng_zero = this.show_frame.second < 10 ? "0" :'';
    return ldng_zero + this.show_frame.second;

  }
},
});
