# Integration Tests 🧪🔗

This directory houses the **global and multi-component integration tests** for our Django project. 

Unlike unit tests, which isolate and verify individual pieces of logic, the tests in this folder ensure that different apps, database records, routing layers, and third-party systems work together seamlessly as a unified platform.

---

## 🛠️ Unit Tests vs. Integration Tests

To maintain a fast and reliable test suite, our testing architecture is split into two distinct layers:

| Feature | Unit Tests 🧪 | Integration Tests 🔗 |
| :--- | :--- | :--- |
| **Location** | **Inside each individual app folder** (e.g., `students/tests/`) | **Inside this top-level `/tests` directory** |
| **Focus** | Isolated logic (Model methods, properties, helper functions). | End-to-end user workflows, API cycles, and cross-app communication. |
| **Speed** | Sub-second execution (often runs entirely in-memory). | Medium to slow (interacts with databases, filesystems, or network layers). |
| **Philosophy** | "Does this specific function calculate the correct output?" | "Does a user clicking 'Submit' successfully save records and update the entire system?" |

---

## 🚀 How to Run the Tests

You can run these tests locally or allow the CI/CD pipeline to execute them automatically.

### 1. Run Only Integration Tests (This Directory)
To execute the tests located inside this root folder, target the package path directly:
```bash
python manage.py test tests
```

### 2. Run Only Unit Tests (App-Specific)
To keep your local feedback loop fast while writing code, you can run the unit tests for a specific app without spinning up the global integration suite:
```bash
python manage.py test students.tests
```

### 3. Run the Entire Test Suite
To verify the entire codebase (all app unit tests + all global integration tests) before pushing your branch:
```bash
python manage.py test
```

---

## 📝 Guidelines for Writing Integration Tests

When adding a test to this folder, please stick to the following conventions:

1. **File Naming:** All test files must start with the prefix `test_` (e.g., `test_student_enrollment_flows.py`) so Django's test runner can automatically discover them.
2. **Focus on Workflows:** Avoid testing simple model properties here. Use these files to simulate the **Request-Response Cycle** using Django’s HTTP Client (`self.client.post()`, `self.client.get()`).
3. **Clean Up After Yourself:** If your integration test generates local files or media files during execution, ensure they are deleted in the test class's `tearDown()` method.
