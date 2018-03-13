{-# LANGUAGE OverloadedStrings #-}
module Main where

import System.Environment
import System.Exit
-- import qualified Data.ByteString.Lazy as BSL
import qualified Data.ByteString.Lazy.Char8 as BSLC
import Data.Aeson
import Data.Aeson.Types
import Data.Either
import qualified Data.HashMap.Strict as HM
import qualified Data.Text as T
import Data.Scientific
import Data.Maybe
import qualified Data.IntSet as IS
import qualified Data.Set as S

{-

TODO: battle data loader

- from kc3 exports
- from poi battle details

-}

data KC3RawRecord = KC3RawRecord
  { table :: T.Text
  , record :: Object
  } deriving Show

data KC3BattleRecord = KC3BattleRecord
  { sortieId :: Int
  , bKeys :: [T.Text]
  } deriving Show

instance FromJSON KC3RawRecord where
    parseJSON (Object v) = KC3RawRecord <$> v .: "table" <*> v .: "record"
    parseJSON invalid = typeMismatch "KC3RawRecord" invalid

fromRawRecord :: KC3RawRecord -> Maybe KC3BattleRecord
fromRawRecord raw
    | table raw == "battle" = do
        (Number sci) <- HM.lookup "sortie_id" (record raw)
        n <- toBoundedInteger sci
        pure (KC3BattleRecord n (HM.keys (record raw)))
    | otherwise = Nothing

kc3Loader :: [String] -> IO ()
kc3Loader args = case args of
    fname:_ -> do
        raws <- BSLC.lines <$> BSLC.readFile fname
        let decodedRaws = eitherDecode <$> raws :: [Either String KC3RawRecord]
            parsed = rights decodedRaws
            sCount = length parsed :: Int
            eCount = length (lefts decodedRaws) :: Int
            battleRaws = mapMaybe fromRawRecord parsed
            sortieIdSet = IS.fromList (map sortieId battleRaws)
            allKeys = foldr (\r -> S.union (S.fromList $ bKeys r)) S.empty battleRaws
        putStrLn $ "(success, error) = " ++ show (sCount, eCount)
        putStrLn $ "battle count: (valid, all) = " ++ show (length battleRaws, length parsed)
        putStrLn $ "unique sortie id count: " ++ show (IS.size sortieIdSet)
        putStrLn $ "keys: " ++ show allKeys
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
