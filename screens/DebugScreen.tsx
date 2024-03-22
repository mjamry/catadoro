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
import { Routes } from '../common/Routes';
import useUseShareLogs from '../common/ShareLogsButton'
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from './RootScreenParams';

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
    backgroundColor: 'lightred',
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
  const logEntries = useDebugStore(state => state.logs);
  const clearLogs = useDebugStore(state => state.clear);
  const setIsDebugLogOn = useDebugStore(state => state.setIsDev);
  const isDebugLogOn = useDebugStore(state => state.isDebugLogLevel);
  const log = useLoggerService('DLog');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [internalLogs, setInternalLogs] = useState<DebugLogEntry[]>([]);
  const [isSimpleModeOn, setSimpleMode] = useState(true);
  const share = useUseShareLogs();
  const nav = useNavigation<NavigationProps>();
  
  const toggleDevMode = () => {
    setIsDebugLogOn(!isDebugLogOn);
  };

  const toggleSimpleMode = () => {
    setSimpleMode(!isSimpleModeOn);
  };

  // const handleSave = async () => {
  //   try {
  //     let dir = await DocumentPicker.getDocumentAsync();
  //     let fileName = getLogFileName();
  //     setIsBusy(true);
      
  //     await FileSystem.writeAsStringAsync(FileSystem.bundleDirectory, JSON.stringify(logEntries), { encoding: 'utf8' });
  //     log.info(`Log saved in: ${decodeURIComponent(FileSystem.bundleDirectory)}/${fileName}`);
  //   } catch (err: any) {
  //     log.error(`Log write error: ${err.message}`, err);
  //   } finally {
  //     setIsBusy(false);
  //   }
  // };

  const handleClearLog = () => {
    clearLogs();
  };

  return (
    <>
      <View style={styles.root}>
        <View style={styles.buttonRow}>
          <View style={styles.switch}>
            <Text>Debug logs</Text>
            <Switch onValueChange={toggleDevMode} value={isDebugLogOn} />
          </View>
          <View style={styles.switch}>
            <Text>Simple view</Text>
            <Switch onValueChange={toggleSimpleMode} value={isSimpleModeOn} />
          </View>
          <IconButton onPress={() => share()} size={'small'} type={'share'} />
          <IconButton onPress={() => nav.navigate(Routes.home)} size={'small'} type={'clock'} />
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
