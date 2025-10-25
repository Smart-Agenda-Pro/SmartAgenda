package expo.modules.plugin

import org.gradle.api.Plugin
import org.gradle.api.Project

class ExpoModulePlugin implements Plugin<Project> {
    @Override
    void apply(Project project) {
        def expoModulesCorePlugin = new File(project.rootProject.file("../node_modules/expo-modules-core/android/ExpoModulesCorePlugin.gradle"))
        if (expoModulesCorePlugin.exists()) {
            project.apply from: expoModulesCorePlugin
            project.ext.applyKotlinExpoModulesCorePlugin()
        }
    }
}
