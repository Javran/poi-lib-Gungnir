module Main where

import System.Environment
import System.Exit

{-

TODO: battle data loader

- from kc3 exports
- from poi battle details

-}

kc3Loader :: [String] -> IO ()
kc3Loader _ = pure ()

poiLoader :: [String] -> IO ()
poiLoader _ = pure ()

main :: IO ()
main = do
    args <- getArgs
    case args of
        "kc3":args' -> kc3Loader args'
        "poi":args' -> poiLoader args'
        _ -> do
            putStrLn "gungnir kc3 <args>"
            putStrLn "gungnir poi <args>"
            exitFailure
