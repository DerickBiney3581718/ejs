// Your own loop
// Write a higher-order function loop that provides something like a for loop statement.
//  !It should take a value, a test function, an update function, and a body function. Each iteration, it should first run the test function on the
// !current loop value and stop if that returns false. It should then call the body function, giving it the current value,
//! and finally call the update function to create a new value and start over from the beginning.
// When defining the function, you can use a regular loop to do the actual looping.
function loop<T>(
  val: T,
  testFunc: (n: T) => boolean,
  updateFunc: (n: T) => T,
  bodyFunc: (n: T) => void
): void {
  for (let ind = val; testFunc(ind); ind = updateFunc(ind)) {
    bodyFunc(ind);
  }
}

loop(
  3,
  (n: any) => n > 0,
  (n: any) => n - 1,
  console.log
);
