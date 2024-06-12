'use client'
import { useState } from "react";
import { Box, Button, Input, Select, Text, VStack } from "@chakra-ui/react";

interface Result {
    value: number;
    iterations: number;
    timeTaken: number;
}

function sqrtBroyden(number: number, tolerance = 1e-7, maxIterations = 1000): Result {
    if (number < 0) {
        throw new Error("Cannot compute the square root of a negative number");
    }

    // Initial guess
    let x = number;
    let fx = x * x - number;  // Initial function value
    let J = 2 * x;  // Initial Jacobian approximation (derivative of x^2 - number)

    let iterations = 0;
    let startTime = Date.now(); // Start time for computing time complexity

    while (iterations < maxIterations) {
        // Newton-like step
        let xNext = x - fx / J;

        // Check for convergence
        if (Math.abs(xNext - x) < tolerance) {
            let endTime = Date.now(); // End time for computing time complexity
            let timeTaken = endTime - startTime; // Time taken in milliseconds
            return { value: xNext, iterations: iterations + 1, timeTaken };
        }

        // Update Jacobian approximation using Broyden's formula
        let fxNext = xNext * xNext - number;
        let dx = xNext - x;
        let dfx = fxNext - fx;
        J = J + (dfx - J * dx) / dx;

        x = xNext;
        fx = fxNext;
        iterations++;
    }

    throw new Error("Failed to converge within the maximum number of iterations");
}

function sqrtNewtonRaphson(number: number, tolerance = 1e-7, maxIterations = 1000): Result {
    if (number < 0) {
        throw new Error("Cannot compute the square root of a negative number");
    }

    // Initial guess
    let x = number;

    // Function f(x) = x^2 - number
    function f(x: number): number {
        return x * x - number;
    }

    // Derivative f'(x) = 2x
    function fPrime(x: number): number {
        return 2 * x;
    }

    let iterations = 0;
    let startTime = Date.now(); // Start time for computing time complexity

    while (iterations < maxIterations) {
        let xNext = x - f(x) / fPrime(x);

        // Check for convergence
        if (Math.abs(xNext - x) < tolerance) {
            let endTime = Date.now(); // End time for computing time complexity
            let timeTaken = endTime - startTime; // Time taken in milliseconds
            return { value: xNext, iterations: iterations + 1, timeTaken };
        }

        x = xNext;
        iterations++;
    }

    throw new Error("Failed to converge within the maximum number of iterations");
}

export default function Home() {
    const [number, setNumber] = useState<string>("");
    const [method, setMethod] = useState<string>("newton");
    const [result, setResult] = useState<Result | null>(null);
    const [error, setError] = useState<string>("");

    const handleCompute = () => {
        setError("");
        setResult(null);
        try {
            let computationResult: Result;
            if (method === "newton") {
                computationResult = sqrtNewtonRaphson(parseFloat(number));
            } else {
                computationResult = sqrtBroyden(parseFloat(number));
            }
            setResult(computationResult);
        } catch (e:any) {
            setError(e.message);
        }
    };



    return (
        <Box p={8} height={'100vh'} bg={'black'} color={'white'}>
            <VStack spacing={4}>
                <Text fontSize="2xl">Root Calculation Using Non-Linear Methods</Text>
                <Input
                    height={'55px'}
                    width={'50%'}
                    placeholder="Enter a number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    type="number"
                />
                
                
                <Box display="flex" alignItems={'center'}  justifyContent="center" >
            <Select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                width="650px" // Set the width to 50%
                height={'55px'}
            >
                <option value="newton">Newton-Raphson Method</option>
                <option value="broyden">{`Broyden's Method`}</option>
            </Select>
        </Box>
                <Button onClick={handleCompute} colorScheme="teal">
                    Compute
                </Button>
                {error && <Text color="red.500">{error}</Text>}
                {result && (
                    <Box>
                        <Text>Result: {result.value}</Text>
                        <Text>Iterations: {result.iterations}</Text>
                        <Text>Time Taken: {result.timeTaken} ms</Text>
                    </Box>
                )}
            </VStack>
        </Box>
    );
}
