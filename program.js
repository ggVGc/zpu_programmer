var memory = [
  load_A_indirect(47), // 0 -- Fetch current brightness
  store_A(32),  // 1 -- Set LED brightness (32 is the first LED in the "screen"). This is the "LED setter"
  load_A_indirect(1), // 2 -- Load the previous `store_A` instruction into A
  add_direct(0), //3 -- Increment A with a tiny value a bunch of times
  add_direct(0), // 4 -- Because everything is float values, we can't actually
  add_direct(0), // 5 -- increment with exactly 0.
  add_direct(0), // 6 -- If we use a non-zero very tiny value, it's still
  add_direct(0), // 7 -- larger than one step of screen index.
  add_direct(0), // 8 -- So, let's waste some cycles instead...
  add_direct(0), // 9
  add_direct(0), // 10
  greater_than_A(store_A(46)/10000), // 11 -- Check if we have overshot the screen boundary
  jump_if_zero(16), // 12 -- If we did, jump to reset logic
  store_A(1), // 13 -- Otherwise, overwrite the LED setter with a new `store_A` instructions, which will write to the next index.
  rand_to_mem(47), // 14 -- Randomize a new color
  jump(0), // 15 -- Loop
  load_A_direct(store_A(32)/10000), // 16 -- Generate a fresh LED setter instruction
  store_A(1), // 17 -- Overwrite it. Next time we will write to LED at 32 again.
  jump(0),  //18 -- Loop
  0, 
  0,
  0, 
  0, 
  0, 
  0,
  0,
  0, 
  0, 
  0, 
  0, 
  0, 
  0, 
  0, 
  0, 
  0, 
  0, 
  0, 
  0, 
  0, 
  0, 
  0, 
  0, 
  0, 
  0, 
  0,
  0,
  0,
  value(0.5) // 47 -- Initial brightness
];
