import { Course } from './../model/course';
import { COURSES } from './../../../../server/db-data';
import { CoursesService } from './courses.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

describe('CoursesService', () => {
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

    it('should retrieve all courses', () => {
        coursesService.findAllCourses()
            .subscribe(courses => {

                //Check if returns null or undefined
                expect(courses).toBeTruthy('No courses returned'); 

                //Check if number or courses is correct
                expect(courses.length).toBe(12, 'Incorrect number of courses');

                const course = courses.find(course => course.id == 12);

                //Check if properties received are correct
                expect(course.titles.description).toBe('Angular Testing Course');
            });
        
        //Check if the HTTP calls are made correctly
        //only one call to this url
        const req = httpTestingController.expectOne('/api/courses'); //req is the mock request

        //it was a GET request
        expect(req.request.method).toEqual('GET');

        //pass some Test Data to the mock request
        //Note: we can check the data by puting the URL in the browser http://localhost:9000/api/courses 
        req.flush({payload: Object.values(COURSES)});
    });

    it('should find a course by id', () => {
        coursesService.findCourseById(12)
            .subscribe(course => {

                expect(course).toBeTruthy();
                expect(course.id).toBe(12);
            });
        
        const req = httpTestingController.expectOne('/api/courses/12');

        expect(req.request.method).toEqual('GET');

        req.flush(COURSES[12]);
    })

    it('should save the course data', () => {
        const changes: Partial<Course> = {titles: {description: 'Testing Course'}};

        coursesService.saveCourse(12, changes)
            .subscribe(course => {

                expect(course.id).toBe(12);
            });
            
        const req = httpTestingController.expectOne('/api/courses/12');

        expect(req.request.method).toEqual('PUT');

        expect(req.request.body.titles.description).toEqual(changes.titles.description);

        req.flush({
            ...COURSES[12],
            ...changes
        });
    });

    it('should give an error if save course fails', () => {
        const changes: Partial<Course> = {titles: {description: 'Testing Course'}};

        coursesService.saveCourse(12, changes)
            .subscribe(() => {
                //Here we don't receive any argument because it fails

                fail("the save course operation should have failed");
            }, (error: HttpErrorResponse) => {

                expect(error.status).toBe(500);
            });
        
        const req = httpTestingController.expectOne('/api/courses/12');

        expect(req.request.method).toEqual('PUT');

        req.flush('Save course failed', {
            status: 500,
            statusText: 'Internal Server Error'
        })
    })

    afterEach(() => {
        //Insure that no other unintended HTTP requests are made, we should call this at the end of each test
        httpTestingController.verify();
    });
});