module Main where

import System.Environment
import System.Exit
-- import qualified Data.ByteString.Lazy as BSL
import qualified Data.ByteString.Lazy.Char8 as BSLC
import Data.Aeson
import Data.Either

{-

TODO: battle data loader

- from kc3 exports
- from poi battle details

-}

kc3Loader :: [String] -> IO ()
kc3Loader args = case args of
    fname:_ -> do
        raws <- BSLC.lines <$> BSLC.readFile fname
        let decodedRaws = eitherDecode <$> raws :: [Either String Value]
            sCount = length (rights decodedRaws) :: Int
            eCount = length (lefts decodedRaws) :: Int
        putStrLn $ "(success, error) = " ++ show (sCount, eCount)
        pure ()
    _ -> do
        putStrLn "gungnir kc3 <filename>"
        exitFailure

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
