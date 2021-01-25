import { COURSES } from './../../../../server/db-data';
import { CoursesService } from './courses.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe("CoursesService", () => {
    let coursesService: CoursesService,
    httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                CoursesService
            ]
        });

        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController); //To specify test data
    });

    it("should retrieve all courses", () => {
        coursesService.findAllCourses()
            .subscribe(courses => {

                //Check if returns null or undefined
                expect(courses).toBeTruthy('No courses returned'); 

                //Check if number or courses is correct
                expect(courses.length).toBe(12, 'Incorrect number of courses');

                const course = courses.find(course => course.id == 12);

                //Check if properties received are correct
                expect(course.titles.description).toBe('Angular Testing Course');
            })
        
        //Check if the HTTP calls are made correctly
        //only one call to this url
        const req = httpTestingController.expectOne('/api/courses'); //req is the mock request

        //it was a GET request
        expect(req.request.method).toEqual('GET');

        //pass some Test Data to the mock request
        //Note: we can check the data by puting the URL in the browser http://localhost:9000/api/courses 
        req.flush({payload: Object.values(COURSES)});
    });
});