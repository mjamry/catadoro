import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Button
} from 'react-native';
import { useDebugStore } from '../state/DebugState';
import { DebugLogEntry, DebugLogLevel } from '../common/DebugLogEntry';
import useLoggerService from '../services/logger/LoggerService';

import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import IconButton from '../components/IconButton';
import NavigationButton from '../components/NavigationButton';
import { Routes } from '../Routes';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignSelf: 'stretch',
  },
  title: {
    padding: 0,
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  logContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'LightGray',
  },
  rowContent: {
    flex: 1,
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
  },
  icon: {
    right: 10,
    top: 5,
  },
  collapseIcon: {
    transform: 'rotate(180deg)',
  },
  logMessage: {
    height: 45,
  },
  logInfo: {
    backgroundColor: 'white',
    color: 'black',
  },
  logError: {
    backgroundColor: 'darkred',
    color: 'white',
  },
  logWarning: {
    backgroundColor: 'gold',
    color: 'white',
  },
  logDebug: {
    backgroundColor: '#D3D3D3',
    color: 'black',
  },
  switch: {
    fontSize: 5,
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    backgroundColor: 'silver',
  },
});

type DebugRowProps = {
  log: DebugLogEntry;
  id: number;
  isSimpleModeOn: boolean;
};

const DebugRow = (props: DebugRowProps) => {
  const { log, id, isSimpleModeOn } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const getLevelStyle = (level: DebugLogLevel) => {
    switch (level) {
      case 'I':
        return styles.logInfo;
      case 'E':
        return styles.logError;
      case 'W':
        return styles.logWarning;
      case 'D':
      default:
        return styles.logDebug;
    }
  };

  const getSimpleLog = () => {
    return (
      <View style={styles.logContainer}>
        <Text
          style={getLevelStyle(log.level)}
        >{`[${log.timestamp}] [${log.level}] [${log.prefix}] ${log.message}`}</Text>
      </View>
    );
  };

  const getExtendedLog = () => {
    return (
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.logContainer}
      >
        <View key={id} style={[getLevelStyle(log.level), styles.logMessage]}>
          <View style={styles.row}>
            <Text>
              [{log.timestamp}] [{log.level}]
            </Text>
          </View>
          <View style={styles.row}>
            <Text>
              [{log.prefix}] {log.message}
            </Text>
          </View>
        </View>
        {isExpanded === true ? (
          <View style={getLevelStyle(log.level)}>
            <Text>{JSON.stringify(log.data)}</Text>
          </View>
        ) : (
          <></>
        )}
      </TouchableOpacity>
    );
  };

  return isSimpleModeOn ? getSimpleLog() : getExtendedLog();
};

const DebugScreen = () => {
  const [isBusy, setIsBusy] = useState(false);
  const logEntries = useDebugStore(state => state.logs);
  const clearLogs = useDebugStore(state => state.clear);
  const setIsDebugLogOn = useDebugStore(state => state.setIsDev);
  const isDebugLogOn = useDebugStore(state => state.isDebugLogLevel);
  const log = useLoggerService('DLog');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [internalLogs, setInternalLogs] = useState<DebugLogEntry[]>([]);
  const [isSimpleModeOn, setSimpleMode] = useState(true);

  const toggleDevMode = () => {
    setIsDebugLogOn(!isDebugLogOn);
  };

  const toggleSimpleMode = () => {
    setSimpleMode(!isSimpleModeOn);
  };

  const getLogFileName = () => {
    const withZeros = (value: number, size = 2) => {
      return value.toString().padStart(size, '0');
    };

    const now = new Date();
    return `log_${now.getFullYear()}${withZeros(now.getMonth() + 1)}${withZeros(
      now.getDay(),
    )}_${withZeros(now.getHours())}${withZeros(now.getMinutes())}${withZeros(
      now.getSeconds(),
    )}.txt`;
  };

  const handleShare = async () => {
    setIsBusy(true);

    try {
      const path = `${FileSystem.cacheDirectory}/${getLogFileName()}`;
      await FileSystem.writeAsStringAsync(path, JSON.stringify(logEntries), { encoding: 'utf8' });
      const fileUri = 'file://' + path;


      // const shareOptions = {
      //   social: Social.Email,
      //   message: 'Log file attached',
      //   subject: `[VanAutomation][Log] ${new Date().toISOString()}`,
      //   url: fileUri,
      //   type: 'text/plain',
      //   email: 'michal.jamry@gmail.com',
      //   appId: '',
      // };

      // const shareResult = await Share.open(shareOptions);
      await Sharing.shareAsync(fileUri);
      // log.info('Share result', shareResult);
    } catch (err: any) {
      log.error(`Log write error: ${err.message}`, err);
    } finally {
      setIsBusy(false);
    }
  };

  const handleSave = async () => {
    try {
      let dir = await DocumentPicker.getDocumentAsync();
      let fileName = getLogFileName();
      setIsBusy(true);
      
      await FileSystem.writeAsStringAsync(FileSystem.bundleDirectory, JSON.stringify(logEntries), { encoding: 'utf8' });
      log.info(`Log saved in: ${decodeURIComponent(FileSystem.bundleDirectory)}/${fileName}`);
    } catch (err: any) {
      log.error(`Log write error: ${err.message}`, err);
    } finally {
      setIsBusy(false);
    }
  };

  const handleClearLog = () => {
    clearLogs();
  };

  return (
    <>
      <View style={styles.root}>
      <NavigationButton icon={'clock'} route={Routes.home} />
        <View style={styles.buttonRow}>
          <View style={styles.switch}>
            <Text>Debug logs</Text>
            <Switch onValueChange={toggleDevMode} value={isDebugLogOn} />
          </View>
          <View style={styles.switch}>
            <Text>Simple view</Text>
            <Switch onValueChange={toggleSimpleMode} value={isSimpleModeOn} />
          </View>
          <IconButton onPress={handleShare} size={'small'} type={'clock'} />
        </View>
        <FlatList
          data={logEntries.slice(0).reverse()}
          renderItem={logEntry => (
            <DebugRow
              log={logEntry.item}
              id={logEntry.index}
              isSimpleModeOn={isSimpleModeOn}
            />
          )}
        />
      </View>
    </>
  );
};

export default DebugScreen;
