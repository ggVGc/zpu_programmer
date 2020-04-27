function value(value) {
  return value * 10000;
}

function instruction(instruction, arg) {
  if(arg < 0 || arg > 1){
    throw "Argument must be in range [0, 1.0]"
  }
  
  return instruction*625 + 1 + arg*624;
}

function memory_reference(mem_location) {
  return (memloc_value(mem_location) * 10000) + 10;
}

function memloc_value(mem_location) {
  let mem_location_count = 16 * 4;
  if(mem_location < 0 || mem_location > mem_location_count){
    throw "Memory location must be in range [0, "+(mem_location_count - 1) + "]";
  }

  return mem_location / mem_location_count;
}

function load_A_indirect(mem_location) {
  return instruction(7, memloc_value(mem_location));
}

let GREATER = 8;

function greater_than_A(value) {
  return instruction(GREATER, value);
}

function mul_A_direct(value){
  return instruction(1, value);
}

function store_A(mem_location) {
  return instruction(2, memloc_value(mem_location));
}

let ADD_DIRECT = 3;
function add_direct(value) {
  return instruction(ADD_DIRECT, value);
}

let LOAD_A_DIRECT = 4;
function load_A_direct(value) {
  return instruction(LOAD_A_DIRECT, value);
}

function jump_if_zero(to_mem_location) {
  return instruction(5, memloc_value(to_mem_location));
}

function jump(to_mem_location) {
  return instruction(9, memloc_value(to_mem_location));
}

// Put random value in the memory location indexed by the value at `mem_location`
// Double-indirect
function rand_to_mem(double_indirect_mem_location) {
  return instruction(6, memloc_value(double_indirect_mem_location));
}

function nop() {
  return instruction(0, 0);
}

