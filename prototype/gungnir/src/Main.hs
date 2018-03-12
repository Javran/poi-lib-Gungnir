{-# LANGUAGE OverloadedStrings #-}
module Main where

import System.Environment
import System.Exit
-- import qualified Data.ByteString.Lazy as BSL
import qualified Data.ByteString.Lazy.Char8 as BSLC
import Data.Aeson
import Data.Aeson.Types
import Data.Either
import qualified Data.Text as T

{-

TODO: battle data loader

- from kc3 exports
- from poi battle details

-}

data KC3RawRecord = KC3RawRecord
  { table :: T.Text
  , record :: Object
  } deriving Show

instance FromJSON KC3RawRecord where
    parseJSON (Object v) = KC3RawRecord <$> v .: "table" <*> v .: "record"
    parseJSON invalid = typeMismatch "KC3RawRecord" invalid

kc3Loader :: [String] -> IO ()
kc3Loader args = case args of
    fname:_ -> do
        raws <- BSLC.lines <$> BSLC.readFile fname
        let decodedRaws = eitherDecode <$> raws :: [Either String KC3RawRecord]
            parsed = rights decodedRaws
            sCount = length parsed :: Int
            eCount = length (lefts decodedRaws) :: Int
            battleRaws = filter isBattle parsed
              where
                isBattle d = table d == "battle"
        putStrLn $ "(success, error) = " ++ show (sCount, eCount)
        putStrLn $ "battle count = " ++ show (length battleRaws)
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
