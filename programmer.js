let ZOIA_MIDI_PORT_NAME = "USB Midi MIDI 1";


if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({sysex: false}).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI support in your browser.");
}

function onMIDIFailure(e) {
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}


var zoia;

let timeout = 1;
let CC = 176;

function clear_serial(callback){
  clear_value(function(){
    delayed(function(){
      zoia.send([CC, 1, 127]);
      delayed(function(){
        zoia.send([CC, 2, 127]); // trigger value
        delayed(function(){
          zoia.send([CC, 2, 0]); // trigger value
          delayed(function(){
            zoia.send([CC, 1, 0]);
            delayed(function(){
              callback();
            });
          });
        });
      });
    });
  });

}


function set_mem_index(ind, callback) {
  var index_val = (ind / 64) * 128;
  console.log("Setting index: " + (index_val / 128));
  zoia.send([CC, 0, index_val]); // Select index
  delayed(callback);
}


function clear_value(callback) {
  delayed(function(){
    zoia.send([CC, 1, 0]);
    delayed(function(){
      empty_value(function(){
        delayed(function(){
          zoia.send([CC, 2, 127]); // trigger value
          delayed(function(){
            zoia.send([CC, 2, 0]); // trigger value
            delayed(function(){
              empty_value(callback);
            });
          });
        });
      });
    });
  });
}


function trigger_current_value(callback) {
  zoia.send([CC, 2, 127]); // trigger value
  delayed(function(){
    zoia.send([CC, 2, 0]); // trigger value
    delayed(callback);
  });
}


function set_programmer_enable(callback) {
  zoia.send([CC, 5, 127]);
  delayed(callback);
}

function disable_programmer() {
  zoia.send([CC, 5, 0]);
}



function delayed(callback) {
  setTimeout(function(){
    callback();
  }, timeout);
}

// midi functions
function onMIDISuccess(midi) {
    console.log('MIDI Access Object', midi);
    let outputs = midi.outputs.values();
    for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
      console.log(output);
        if(output.value.name == ZOIA_MIDI_PORT_NAME){
          zoia = output.value;
          console.log("Found Zoia");
          break;
        }
    }

  zoia.open()

  var i = 0;



  function set_next_mem_location(){
    var entry_value = memory[i];
    function after_append_value() {
      if(entry_value > 0){
        append();
      }else{
        if(i < memory.length){
          zoia.send([CC, 4, 127]); // trigger value
          delayed(function(){
            zoia.send([CC, 4, 0]); // trigger value
            i++;
              delayed(set_next_mem_location);
          });
        }else{
          console.log("DONE");
          empty_value(function(){
            disable_programmer();
            delayed(function(){
              zoia.send([CC, 0, 0]); // trigger
            });
          });
        }
      }
    }

    function append(){
      if (entry_value >= 100) {
        entry_value-=100;
        set_value(100, function(){
          trigger_current_value(after_append_value);
        })
      }else{
        entry_value-=1;
        set_value(1, function(){
          trigger_current_value(after_append_value);
        })
      }
    }

    set_programmer_enable(function(){
      set_mem_index(i, function(){
        clear_serial(function(){
          console.log("Wriring value: "+entry_value);
          delayed(function(){
            if(entry_value > 0){
              append();
            }else{
              after_append_value();
            }
          });
        });
      });
    })

  }

  set_next_mem_location();
}


function empty_value(callback){
  zoia.send([CC, 3, 0]);
  delayed(function(){
    zoia.send([CC, 6, 0]);
    delayed(callback);
  });
}


var last_val = -1;
function set_value(val, callback) {
  if(last_val == val){
    callback();
  }else{
    if (val == 100) {
      zoia.send([CC, 3, 0]);
      delayed(function(){
        zoia.send([CC, 6, 127]);
        delayed(callback);
      });
    }else{
      zoia.send([CC, 6, 0]);
      delayed(function(){
        zoia.send([CC, 3, 127]);
        delayed(callback);
      });
    }
  }
}
