// 'use client'
// import React, { useState } from 'react';
// import { Box, Button, Text, VStack, StackDivider } from '@chakra-ui/react';
// import Plot from 'react-plotly.js';

// // Function to evaluate f(x)
// const evaluateFunction = (func: any, x: any) => {
//   try {
//     return new Function('x', `return ${func}`)(x);
//   } catch (error) {
//     alert('Error in function expression');
//     return NaN;
//   }
// };

// // Newton's method function with iteration logging
// const newtonsMethod = (func: string, derivative: string, initialGuess: number, tolerance = 1e-7, maxIterations = 1000) => {
//   let x = initialGuess;
//   const iterations = [];
//   const startTime = performance.now();

//   for (let i = 0; i < maxIterations; i++) {
//     const fx = evaluateFunction(func, x);
//     const fpx = evaluateFunction(derivative, x);
//     const nextX = x - fx / fpx;

//     iterations.push({ iteration: i + 1, x, fx, fpx, nextX });

//     if (Math.abs(nextX - x) < tolerance) {
//       const endTime = performance.now();
//       return { root: nextX, iterations, totalTime: endTime - startTime };
//     }
//     x = nextX;
//   }
//   const endTime = performance.now();
//   return { root: null, iterations, totalTime: endTime - startTime }; // Return null if no convergence
// };

// // Secant method function
// const secantMethod = (func: string, x0: number, x1: number, tolerance = 1e-7, maxIterations = 1000) => {
//   const iterations = [];
//   const startTime = performance.now();

//   for (let i = 0; i < maxIterations; i++) {
//     const fx0 = evaluateFunction(func, x0);
//     const fx1 = evaluateFunction(func, x1);
//     const nextX = x1 - fx1 * (x1 - x0) / (fx1 - fx0);

//     iterations.push({ iteration: i + 1, x0, x1, fx0, fx1, nextX });

//     if (Math.abs(nextX - x1) < tolerance) {
//       const endTime = performance.now();
//       return { root: nextX, iterations, totalTime: endTime - startTime };
//     }
//     x0 = x1;
//     x1 = nextX;
//   }
//   const endTime = performance.now();
//   return { root: null, iterations, totalTime: endTime - startTime }; // Return null if no convergence
// };

// // Broyden's method function
// const broydensMethod = (func: string, x0: number, tolerance = 1e-7, maxIterations = 1000) => {
//   let x = x0;
//   let fx = evaluateFunction(func, x);
//   let J_inv = 1 / fx; // Initial guess for J^-1
//   const iterations = [];
//   const startTime = performance.now();

//   for (let i = 0; i < maxIterations; i++) {
//     const deltaX = -J_inv * fx;
//     const nextX = x + deltaX;

//     if (Math.abs(nextX - x) < tolerance) {
//       const endTime = performance.now();
//       return { root: nextX, iterations, totalTime: endTime - startTime };
//     }

//     const newFx = evaluateFunction(func, nextX);
//     const deltaF = newFx - fx;
//     const deltaXTF = deltaX * deltaF;

//     if (Math.abs(deltaXTF) > tolerance) {
//       J_inv = J_inv + (deltaX - J_inv * deltaF) / deltaXTF;
//     }

//     iterations.push({ iteration: i + 1, x, fx, J_inv, nextX });

//     x = nextX;
//     fx = newFx;
//   }
//   const endTime = performance.now();
//   return { root: null, iterations, totalTime: endTime - startTime }; // Return null if no convergence
// };

// const equations = [
//   { 
//     func: '3*x + Math.sin(x) - Math.exp(x)', 
//     derivative: '3 + Math.cos(x) - Math.exp(x)', 
//     initialGuess: 1, 
//     initialGuessSecant: [0, 1] 
//   },
//   { 
//     func: 'Math.pow(x, 3) - 2*Math.pow(x, 2) - 4*x + 8', 
//     derivative: '3*Math.pow(x, 2) - 4*x - 4', 
//     initialGuess: 1, 
//     initialGuessSecant: [0, 2] 
//   },
//   { 
//     func: 'Math.cos(x) - x', 
//     derivative: '-Math.sin(x) - 1', 
//     initialGuess: 1, 
//     initialGuessSecant: [0, 1] 
//   },
//   { 
//     func: 'Math.exp(x) - 3*Math.pow(x, 2)', 
//     derivative: 'Math.exp(x) - 6*x', 
//     initialGuess: 1, 
//     initialGuessSecant: [0, 1] 
//   },
//   { 
//     func: 'Math.pow(x, 2) - 2', 
//     derivative: '2*x', 
//     initialGuess: 1, 
//     initialGuessSecant: [0, 2] 
//   }
// ];

// const RootFindingSolver = () => {
//   const [results, setResults] = useState<any>([]);

//   const solveEquations = () => {
//     const newResults = equations.map(eq => {
//       const newtonResult = newtonsMethod(eq.func, eq.derivative, eq.initialGuess);
//       const secantResult = secantMethod(eq.func, eq.initialGuessSecant[0], eq.initialGuessSecant[1]);
//       const broydenResult = broydensMethod(eq.func, eq.initialGuess);
//       return { ...eq, newtonResult, secantResult, broydenResult };
//     });
//     setResults(newResults);
//   };

//   return (
//     <Box p={5}>
//       <Button onClick={solveEquations} colorScheme="teal">Solve All Equations</Button>
//       {results.length > 0 && (
//         <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4} align="stretch" mt={5}>
//           {results.map((result: { func: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; newtonResult: { root: number | null; iterations: any[]; totalTime: number; }; secantResult: { root: number | null; iterations: any[]; totalTime: number; }; broydenResult: { root: number | null; iterations: any[]; totalTime: number; }; }, index: string) => (
//             <Box key={index} p={5} borderWidth="1px" borderRadius="lg">
//               <Text fontSize="xl">Equation {index + 1}: {result.func}</Text>
//               <Text fontSize="md">{`Newton's Method:`}</Text>
//               <Text>Solution: {result.newtonResult.root !== null ? result.newtonResult.root.toFixed(6) : 'No convergence'}</Text>
//               <Text>Total Iterations: {result.newtonResult.iterations.length}</Text>
//               <Text>Total Time: {result.newtonResult.totalTime.toFixed(2)} ms</Text>
//               <Text fontSize="md" mt={3}>Secant Method:</Text>
//               <Text>Solution: {result.secantResult.root !== null ? result.secantResult.root.toFixed(6) : 'No convergence'}</Text>
//               <Text>Total Iterations: {result.secantResult.iterations.length}</Text>
//               <Text>Total Time: {result.secantResult.totalTime.toFixed(2)} ms</Text>
//               <Text fontSize="md" mt={3}>{`Broyden's Method:`}</Text>
//               <Text>Solution: {result.broydenResult.root !== null ? result.broydenResult.root.toFixed(6) : 'No convergence'}</Text>
//               <Text>Total Iterations: {result.broydenResult.iterations.length}</Text>
//               <Text>Total Time: {result.broydenResult.totalTime.toFixed(2)} ms</Text>

//               {/* Plot for Newton's Method */}
//               <Plot
//                 data={[
//                   {
//                     x: result.newtonResult.iterations.map((i: { iteration: any; }) => i.iteration),
//                     y: result.newtonResult.iterations.map((i: { fx: number; }) => Math.abs(i.fx)),
//                     type: 'scatter',
//                     mode: 'lines+markers',
//                     marker: {color: 'blue'},
//                     name: "Newton's Method"
//                   },
//                   {
//                     x: result.secantResult.iterations.map((i: { iteration: any; }) => i.iteration),
//                     y: result.secantResult.iterations.map((i: { fx1: number; }) => Math.abs(i.fx1)),
//                     type: 'scatter',
//                     mode: 'lines+markers',
//                     marker: {color: 'red'},
//                     name: "Secant Method"
//                   },
//                   {
//                     x: result.broydenResult.iterations.map((i: { iteration: any; }) => i.iteration),
//                     y: result.broydenResult.iterations.map((i: { fx: number; }) => Math.abs(i.fx)),
//                     type: 'scatter',
//                     mode: 'lines+markers',
//                     marker: {color: 'green'},
//                     name: "Broyden's Method"
//                   }
//                 ]}
//                 layout={{width: 600, height: 400, title: `Convergence for Equation ${index + 1}`}}
//               />
//             </Box>
//           ))}
//         </VStack>
//       )}
//     </Box>
//   );
// };

// export default RootFindingSolver;
export default function test(){
  return(
    "test"
  )
}
