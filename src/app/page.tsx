'use client';

import React, { useState } from 'react';
import { Box, Button, Input, Text, VStack, StackDivider, Select } from '@chakra-ui/react';

// Function to evaluate f(x)
const evaluateFunction = (func: string, x: number) => {
  try {
    return new Function('x', `return ${func}`)(x);
  } catch (error) {
    alert('Error in function expression');
    return NaN;
  }
};

// Newton's method function with iteration logging
const newtonsMethod = (func: string, derivative: string, initialGuess: number, tolerance = 1e-7, maxIterations = 1000) => {
  let x = initialGuess;
  const iterations = [];
  const startTime = performance.now();

  for (let i = 0; i < maxIterations; i++) {
    const fx = evaluateFunction(func, x);
    const fpx = evaluateFunction(derivative, x);
    const nextX = x - fx / fpx;

    iterations.push({ iteration: i + 1, x, fx, fpx, nextX });

    if (Math.abs(nextX - x) < tolerance) {
      const endTime = performance.now();
      return { root: nextX, iterations, totalTime: endTime - startTime };
    }
    x = nextX;
  }
  const endTime = performance.now();
  return { root: null, iterations, totalTime: endTime - startTime }; // Return null if no convergence
};

// Secant method function
const secantMethod = (func: string, x0: number, x1: number, tolerance = 1e-7, maxIterations = 1000) => {
  const iterations = [];
  const startTime = performance.now();

  for (let i = 0; i < maxIterations; i++) {
    const fx0 = evaluateFunction(func, x0);
    const fx1 = evaluateFunction(func, x1);
    const nextX = x1 - fx1 * (x1 - x0) / (fx1 - fx0);

    iterations.push({ iteration: i + 1, x0, x1, fx0, fx1, nextX });

    if (Math.abs(nextX - x1) < tolerance) {
      const endTime = performance.now();
      return { root: nextX, iterations, totalTime: endTime - startTime };
    }
    x0 = x1;
    x1 = nextX;
  }
  const endTime = performance.now();
  return { root: null, iterations, totalTime: endTime - startTime }; // Return null if no convergence
};

const RootFindingSolver = () => {
  const [method, setMethod] = useState('Newton');
  const [func, setFunc] = useState('3*x + Math.sin(x) - Math.exp(x)');
  const [derivative, setDerivative] = useState('3 + Math.cos(x) - Math.exp(x)');
  const [initialGuess, setInitialGuess] = useState('');
  const [initialGuess2, setInitialGuess2] = useState('');
  const [result, setResult] = useState<null | string>(null);
  const [iterations, setIterations] = useState<any>([]);
  const [totalTime, setTotalTime] = useState<null | number>(null);

  const handleSolve = () => {
    const guess = parseFloat(initialGuess);
    const guess2 = parseFloat(initialGuess2);
    if (method === 'Newton' && isNaN(guess)) {
      alert('Please enter a valid initial guess.');
      return;
    }
    if (method === 'Secant' && (isNaN(guess) || isNaN(guess2))) {
      alert('Please enter two valid initial guesses.');
      return;
    }

    let solution;
    if (method === 'Newton') {
      solution = newtonsMethod(func, derivative, guess);
    } else if (method === 'Secant') {
      solution = secantMethod(func, guess, guess2);
    }

    if (!solution) {
      setResult('No solution found');
      setIterations([]);
      setTotalTime(null);
      return;
    }

    const { root, iterations, totalTime } = solution;
    setResult(root !== null ? root.toFixed(6) : 'No convergence');
    setIterations(iterations);
    setTotalTime(totalTime);
  };

  return (
    <Box p={5}>
      <Text fontSize="xl" mb={3}>Numerical methods</Text>
      <Select
        placeholder="Select method"
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        mb={3}
      >
        <option value="Newton">{`Newton's Method`}</option>
        <option value="Secant">{`Secant Method`}</option>
      </Select>
      <Input
        placeholder="Enter function f(x)"
        value={func}
        onChange={(e) => setFunc(e.target.value)}
        mb={3}
      />
      {method === 'Newton' && (
        <Input
          placeholder="Enter derivative f'(x)"
          value={derivative}
          onChange={(e) => setDerivative(e.target.value)}
          mb={3}
        />
      )}
      {(method === 'Newton' || method === 'Secant') && (
        <Input
          placeholder="Enter initial guess"
          value={initialGuess}
          onChange={(e) => setInitialGuess(e.target.value)}
          mb={3}
        />
      )}
      {method === 'Secant' && (
        <Input
          placeholder="Enter second initial guess"
          value={initialGuess2}
          onChange={(e) => setInitialGuess2(e.target.value)}
          mb={3}
        />
      )}
      <Button onClick={handleSolve} colorScheme="teal">Solve</Button>
      {result !== null && (
        <Box mt={3}>
          <Text>Solution: {result}</Text>
          <Text>Total Iterations: {iterations.length}</Text>
          <Text>Total Time: {totalTime?.toFixed(2)} ms</Text>
          <VStack
            divider={<StackDivider borderColor="gray.200" />}
            spacing={4}
            align="stretch"
            mt={3}
          >
            {iterations.map((iter: { iteration: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; x: number | undefined; fx: number | undefined; fpx: number | undefined; nextX: number | undefined; x0: number | undefined; x1: number | undefined; fx0: number | undefined; fx1: number | undefined; }, index: string) => (
              <Box key={index} p={2} borderWidth="1px" borderRadius="lg">
                <Text>Iteration {iter.iteration}:</Text>
                {iter.x !== undefined && <Text>x: {iter.x.toFixed(6)}</Text>}
                {iter.fx !== undefined && <Text>f(x): {iter.fx.toFixed(6)}</Text>}
                {iter.fpx !== undefined && <Text>{`f'(x)`}: {iter.fpx.toFixed(6)}</Text>}
                {iter.nextX !== undefined && <Text>Next x: {iter.nextX.toFixed(6)}</Text>}
                {iter.x0 !== undefined && <Text>x0: {iter.x0.toFixed(6)}</Text>}
                {iter.x1 !== undefined && <Text>x1: {iter.x1.toFixed(6)}</Text>}
                {iter.fx0 !== undefined && <Text>f(x0): {iter.fx0.toFixed(6)}</Text>}
                {iter.fx1 !== undefined && <Text>f(x1): {iter.fx1.toFixed(6)}</Text>}
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default RootFindingSolver;





// import React, { useState } from 'react';
// import { Box, Button, Input, Text, VStack, HStack, StackDivider, Select, Textarea } from '@chakra-ui/react';
// import * as math from 'mathjs';

// // Function to evaluate a single function at a given point
// const evaluateFunction = (func, x) => {
//   try {
//     return new Function('x', `return ${func}`)(x);
//   } catch (error) {
//     alert(`Error in function expression: ${func}`);
//     return NaN;
//   }
// };

// // Function to evaluate multiple functions at a given point
// const evaluateFunctions = (funcs, x) => funcs.map(func => evaluateFunction(func, x));

// // Newton's method function for systems of equations
// const newtonsMethodSystem = (funcs, jacobianFunc, initialGuess, tolerance = 1e-7, maxIterations = 1000) => {
//   let x = initialGuess;
//   const iterations = [];
//   const startTime = performance.now();

//   for (let i = 0; i < maxIterations; i++) {
//     const fx = evaluateFunctions(funcs, x);
//     const J = jacobianFunc(x);
//     const J_inv = math.inv(J);
//     const deltaX = math.multiply(J_inv, fx);
//     const nextX = math.subtract(x, deltaX);

//     iterations.push({ iteration: i + 1, x, fx, J, nextX });

//     if (math.norm(deltaX) < tolerance) {
//       const endTime = performance.now();
//       return { root: nextX, iterations, totalTime: endTime - startTime };
//     }
//     x = nextX;
//   }
//   const endTime = performance.now();
//   return { root: null, iterations, totalTime: endTime - startTime }; // Return null if no convergence
// };

// // Broyden's method function for systems of equations
// const broydensMethodSystem = (funcs, x0, tolerance = 1e-7, maxIterations = 1000) => {
//   let x = x0;
//   let fx = evaluateFunctions(funcs, x);
//   let J_inv = math.inv(math.identity(fx.length)); // Initial guess for J^-1
//   const iterations = [];
//   const startTime = performance.now();

//   for (let i = 0; i < maxIterations; i++) {
//     const deltaX = math.multiply(J_inv, fx);
//     const nextX = math.subtract(x, deltaX);

//     if (math.norm(deltaX) < tolerance) {
//       const endTime = performance.now();
//       return { root: nextX, iterations, totalTime: endTime - startTime };
//     }

//     const newFx = evaluateFunctions(funcs, nextX);
//     const deltaF = math.subtract(newFx, fx);
//     const deltaXTF = math.multiply(deltaX, deltaF);

//     if (math.norm(deltaXTF) > tolerance) {
//       const J_invUpdate = math.divide(math.subtract(deltaX, math.multiply(J_inv, deltaF)), deltaXTF);
//       J_inv = math.add(J_inv, J_invUpdate);
//     }

//     iterations.push({ iteration: i + 1, x, fx, J_inv, nextX });

//     x = nextX;
//     fx = newFx;
//   }
//   const endTime = performance.now();
//   return { root: null, iterations, totalTime: endTime - startTime }; // Return null if no convergence
// };

// const RootFindingSolver = () => {
//   const [method, setMethod] = useState('Newton');
//   const [problemType, setProblemType] = useState('Single');
//   const [func, setFunc] = useState('3*x + Math.sin(x) - Math.exp(x)');
//   const [funcs, setFuncs] = useState(['x1 + x2 - 3', 'x1^2 + x2^2 - 9']);
//   const [derivative, setDerivative] = useState('3 + Math.cos(x) - Math.exp(x)');
//   const [jacobian, setJacobian] = useState(['1, 1', '2*x1, 2*x2']);
//   const [initialGuess, setInitialGuess] = useState('2, 2');
//   const [initialGuess2, setInitialGuess2] = useState('');
//   const [result, setResult] = useState(null);
//   const [iterations, setIterations] = useState([]);
//   const [totalTime, setTotalTime] = useState(null);

//   const handleSolve = () => {
//     const guess = parseFloat(initialGuess);
//     const guess2 = parseFloat(initialGuess2);
//     const initialGuessArray = initialGuess.split(',').map(Number);

//     let solution;
//     if (problemType === 'Single') {
//       if (method === 'Newton' && isNaN(guess)) {
//         alert('Please enter a valid initial guess.');
//         return;
//       }
//       if (method === 'Secant' && (isNaN(guess) || isNaN(guess2))) {
//         alert('Please enter two valid initial guesses.');
//         return;
//       }
//       if (method === 'Broyden' && isNaN(guess)) {
//         alert('Please enter a valid initial guess.');
//         return;
//       }

//       if (method === 'Newton') {
//         solution = newtonsMethod(func, derivative, guess);
//       } else if (method === 'Secant') {
//         solution = secantMethod(func, guess, guess2);
//       } else if (method === 'Broyden') {
//         solution = broydensMethod(func, guess);
//       }
//     } else {
//       if (method === 'Newton') {
//         const jacobianFunc = x => {
//           const jacobianMatrix = [];
//           for (let i = 0; i < funcs.length; i++) {
//             jacobianMatrix.push(jacobian[i].split(',').map(expr => evaluateFunction(expr.replace(/x(\d+)/g, (_, g1) => `x[${g1 - 1}]`), x)));
//           }
//           return jacobianMatrix;
//         };
//         solution = newtonsMethodSystem(funcs.map(f => f.replace(/x(\d+)/g, (_, g1) => `x[${g1 - 1}]`)), jacobianFunc, initialGuessArray);
//       } else if (method === 'Broyden') {
//         solution = broydensMethodSystem(funcs.map(f => f.replace(/x(\d+)/g, (_, g1) => `x[${g1 - 1}]`)), initialGuessArray);
//       }
//     }

//     const { root, iterations, totalTime } = solution;

//     let rootDisplay;
//     if (Array.isArray(root)) {
//       rootDisplay = root.map(r => r.toFixed(6)).join(', ');
//     } else if (root !== null) {
//       rootDisplay = root.toFixed(6);
//     } else {
//       rootDisplay = 'No convergence';
//     }

//     setResult(rootDisplay);
//     setIterations(iterations);
//     setTotalTime(totalTime);
//   };

//   const formatNumber = (num) => (typeof num === 'number' ? num.toFixed(6) : 'NaN');

//   return (
//     <VStack spacing={4}>
//       <HStack spacing={4}>
//         <Select value={problemType} onChange={e => setProblemType(e.target.value)}>
//           <option value="Single">Single Variable</option>
//           <option value="System">System of Equations</option>
//         </Select>
//         <Select value={method} onChange={e => setMethod(e.target.value)}>
//           <option value="Newton">Newton's Method</option>
//           {problemType === 'Single' && <option value="Secant">Secant Method</option>}
//           <option value="Broyden">Broyden's Method</option>
//         </Select>
//       </HStack>

//       {problemType === 'Single' ? (
//         <>
//           <Input placeholder="Function" value={func} onChange={e => setFunc(e.target.value)} />
//           {method === 'Newton' && <Input placeholder="Derivative" value={derivative} onChange={e => setDerivative(e.target.value)} />}
//         </>
//       ) : (
//         <>
//           <Textarea placeholder="Functions (comma-separated)" value={funcs.join(', ')} onChange={e => setFuncs(e.target.value.split(', '))} />
//           {method === 'Newton' && <Textarea placeholder="Jacobian (comma-separated functions)" value={jacobian.join(', ')} onChange={e => setJacobian(e.target.value.split(', '))} />}
//         </>
//       )}
//       <Input placeholder="Initial Guess (comma-separated for systems)" value={initialGuess} onChange={e => setInitialGuess(e.target.value)} />
//       {method === 'Secant' && <Input placeholder="Second Initial Guess" value={initialGuess2} onChange={e => setInitialGuess2(e.target.value)} />}
//       <Button onClick={handleSolve}>Solve</Button>

//       {result !== null && (
//         <Box p={4} borderWidth="1px" borderRadius="lg">
//           <Text>Root: {result}</Text>
//           <Text>Total Time: {totalTime} ms</Text>
//         </Box>
//       )}

//       {iterations.length > 0 && (
//         <Box>
//           <Text>Iterations:</Text>
//           <VStack spacing={2} align="stretch">
//             {iterations.map((iter, index) => (
//               <Box key={index} p={2} borderWidth="1px" borderRadius="lg">
//                 <Text>Iteration {iter.iteration}:</Text>
//                 {Array.isArray(iter.x) ? (
//                   <Text>x: [{iter.x.map(xi => formatNumber(xi)).join(', ')}]</Text>
//                 ) : (
//                   <Text>x: {formatNumber(iter.x)}</Text>
//                 )}
//                 <Text>f(x): {Array.isArray(iter.fx) ? iter.fx.map(fxi => formatNumber(fxi)).join(', ') : formatNumber(iter.fx)}</Text>
//                 {iter.J && <Text>J: {iter.J.map(row => `[${row.map(val => formatNumber(val)).join(', ')}]`).join(', ')}</Text>}
//                 <Text>Next x: {Array.isArray(iter.nextX) ? iter.nextX.map(xi => formatNumber(xi)).join(', ') : formatNumber(iter.nextX)}</Text>
//               </Box>
//             ))}
//           </VStack>
//         </Box>
//       )}
//     </VStack>
//   );
// };

// export default RootFindingSolver;
