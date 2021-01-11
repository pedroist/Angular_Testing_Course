import { CoursesService } from './courses.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe("CoursesService", () => {
    let coursesService: CoursesService,
        testingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                CoursesService
            ]
        });

        coursesService = TestBed.get(CoursesService);
        testingController = TestBed.get(HttpTestingController); //To specify test data
    });

    it("should retrieve all courses", () => {

    });
});