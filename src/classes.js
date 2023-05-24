import Phaser from "phaser";



export class Task {
  constructor(name, deadline, category) {
    this.name = name;
    this.deadline = new Date(deadline).getTime();
    this.category = category;
  }
}
// Baddy class
export class Baddy extends Phaser.GameObjects.Sprite {
  constructor(scene, task, x, y) {
    super(scene, x, y, 'baddy');
    scene.add.existing(this);

    this.task = task;
    this.startTime = Date.now();
    this.duration = task.deadline - this.startTime;
    this.distanceX = scene.tower.x - x; // Calculate the distance from the initial x position to the tower
    this.speedPerFrame = (this.distanceX / this.duration) * (1000 / 60);

    this.currentFrame = 0;
    this.frameWidth = 64;
    this.frameHeight = 64;
    this.frameCount = 8;
    this.frameTimer = 0;
    this.frameInterval = 100; // milliseconds

    this.play('baddyAnimation');
  }

  update() {
    const currentTime = Date.now();
    const remainingTime = this.task.deadline - currentTime;
  
    if (remainingTime > 0) {
      const remainingDistance = (this.speedPerFrame * remainingTime) / (1000 / 60);
      const newPosition = this.scene.tower.x - remainingDistance;
      this.x = newPosition;
    } else {
      console.log("Baddy has reached the tower");
      // Handle tower update based on task
      const taskIndex = this.scene.tasks.findIndex((task) => task === this.task);
      if (taskIndex !== -1) {
        this.scene.tasks.splice(taskIndex, 1); // Remove the task from the array
        this.scene.updateTaskList(); // Update the task list
      }
      // Remove the baddy from the array and destroy it
      const baddyIndex = this.scene.baddies.findIndex((b) => b === this);
      if (baddyIndex !== -1) {
        this.scene.baddies.splice(baddyIndex, 1);
        this.destroy();
      }
    }
  }
  
}

// Tower class
export class Tower extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, width, height) {
    super(scene, x, y, 'tower');
    this.displayWidth = width;
    this.displayHeight = height;
    scene.add.existing(this);
  }
}
