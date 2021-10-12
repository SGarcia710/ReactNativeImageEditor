import {ScreenProps} from '@app/@types/screens';
import useProjectsStore, {ProjectsStore} from '@app/stores/useProjectsStore';
import * as React from 'react';
import {useForm, Controller} from 'react-hook-form';
import {
  Button,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface Props extends ScreenProps<RootNavigatorParamList, 'Projects'> {}

const createNewProjectSelector = (state: ProjectsStore) =>
  state.createNewProject;
const removeProjectSelector = (state: ProjectsStore) => state.removeProject;

const projectsSelector = (state: ProjectsStore) => state.projects;

const ProjectsScreen = (props: Props) => {
  const createNewProject = useProjectsStore(createNewProjectSelector);
  const projects = useProjectsStore(projectsSelector);
  const removeProject = useProjectsStore(removeProjectSelector);
  const {
    handleSubmit,
    formState: {errors},
    reset,
    control,
  } = useForm();

  const onSubmit = handleSubmit((data, e) => {
    const projectId = createNewProject(data.projectName);
    reset();
    props.navigation.navigate('Editor', {projectId});
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Projects List</Text>

      <ScrollView style={styles.projectList}>
        {React.Children.toArray(
          Object.values(projects).map(project => {
            return (
              <View style={styles.project}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('Editor', {
                      projectId: project.id,
                    });
                  }}
                  style={styles.projectName}>
                  <Text style={styles.projectNameText}>{project.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeProject(project.id)}>
                  <Image
                    style={styles.deleteProjectIcon}
                    source={require('@app/assets/images/deleteIcon.png')}
                  />
                </TouchableOpacity>
              </View>
            );
          }),
        )}
      </ScrollView>

      <View style={styles.createProjectInput}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              placeholder="Project name"
              placeholderTextColor="#999999"
            />
          )}
          name="projectName"
          defaultValue=""
        />
        {errors.projectName && (
          <Text style={styles.inputError}>Project name is required. </Text>
        )}

        <Button color="white" title="Create new project" onPress={onSubmit} />
      </View>
    </SafeAreaView>
  );
};

export default ProjectsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161616',
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 24,
    color: 'white',
  },
  input: {
    backgroundColor: '#222222',
    color: 'white',
    borderRadius: 4,
    paddingHorizontal: 18,
    paddingVertical: 14,
    width: '100%',
  },
  inputError: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 4,
    fontSize: 12,
  },
  createProjectInput: {
    alignItems: 'center',
  },
  project: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  projectName: {
    flex: 1,
    paddingHorizontal: 8,
    height: 30,
    backgroundColor: 'white',
    marginRight: 8,
    justifyContent: 'center',
    borderRadius: 4,
  },
  projectNameText: {
    fontSize: 16,
  },
  projectList: {
    flex: 1,
  },
  deleteProjectIcon: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
});
