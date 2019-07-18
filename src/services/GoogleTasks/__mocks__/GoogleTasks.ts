class GoogleTasksService {

  isSignedIn() {
    return Promise.resolve(true);
  }

  listTaskLists() {
    return Promise.resolve([]);
  }
}

export default new GoogleTasksService();