import { Component } from "@angular/core";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"]
})
export class SettingsComponent {
  settings = {
    enableNotifications: true,
    darkMode: false,
    language: "עברית"
  };

  saveSettings() {
    console.log("הגדרות נשמרו:", this.settings);
    // כאן תוכל להוסיף שמירה ל-API בעתיד
  }
}
